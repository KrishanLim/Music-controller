from django.shortcuts import redirect
from .credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from rest_framework.views import APIView
from requests import post, Request
from rest_framework import status
from rest_framework.response import Response 
from .utils import *
from myapp.models import Room
from .models import Vote

# Create your views here.

class AuthURL(APIView) :
    permission_classes = []
    authentication_classes= []

    def get(self, request, format=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'client_id' : CLIENT_ID,
            'response_type' : 'code',
            'redirect_uri' : REDIRECT_URI, 
            'scope' : scopes
        }).prepare().url

        return Response({'url' : url}, status=status.HTTP_200_OK)

def spotify_callback (request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type' : 'authorization_code',
        'client_id' : CLIENT_ID,
        'client_secret' : CLIENT_SECRET,
        'code' : code,
        'redirect_uri' : REDIRECT_URI
    }, timeout=5).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    refresh_token = response.get('refresh_token')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('frontend:')
                                        
class IsAuthenticated(APIView):
    permission_classes = []
    authentication_classes= []

    def get(self, request, format=None):
        print("hitting")
        if not request.session.exists(request.session.session_key):
            request.session.create()
        is_authenticated = check_user_is_authenticated(self.request.session.session_key)
        if is_authenticated:
            return Response({'status' : is_authenticated},status=status.HTTP_200_OK)
        return Response({'status' : False},status=status.HTTP_200_OK)

class CurrentSong(APIView):
    permission_classes = []
    authentication_classes= []

    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room_details = Room.objects.filter(code=room_code)

        if room_details.exists() :
            room=room_details[0]
        else:
            return Response({'Room Not Found': 'Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = "player/currently-playing"
        response = execute_spotify_api_request(host, endpoint)

        if 'error' in response or 'item' not in response :
            return Response ({'error' 'No song is currently being played'}, status=status.HTTP_204_NO_CONTENT)
        
        item = response.get('item')
        duration = item.get('duration_ms')
        name = item.get('name')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        artist_string = ""

        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ","
            artist_name= artist.get('name')
            artist_string += artist_name

        song = {
            'title' : name,
            'artist' : artist_string,
            'duration' : duration,
            'time' : progress,
            'image_url' : album_cover,
            'is_playing' : is_playing,
            'song_id' : song_id,
            'votes' : 0
        }
        Room.objects.filter(code=room_code).update(current_song=song['song_id'])
        
        return Response({'success': song}, status=status.HTTP_200_OK)

class PauseSong(APIView):
    permission_classes = []
    authentication_classes= []

    def put(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        user = self.request.session.session_key

        if room.host == user:
            pause_song(room.host, room_code)
            return Response({'success' : 'Song Paused'}, status=status.HTTP_200_OK)

        else:
            response = pause_song(user,room_code)
            if response == {'error' : 'unauthorized'}:
                return Response({'error' : 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

            return Response({'success' : 'Song Paused'}, status=status.HTTP_200_OK)

class PlaySong(APIView):
    permission_classes = []
    authentication_classes= []

    def put(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        user = self.request.session.session_key
        
        if room.host == user:
            response = play_song(room.host, room_code)    
            if response == {'error' : 'unauthorized'}:
                return Response({'error' : 'unauthorized'}, status=status.HTTP_403_FORBIDDEN)

            return Response({'success' : 'Song Played'}, status=status.HTTP_200_OK)

        else:
            play_song(user, room_code) 
            return Response({'success' : 'Song Played'}, status = status.HTTP_200_OK)

class SkipNextSong(APIView):
    permission_classes = []
    authentication_classes= []

    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]
        user=self.request.session.session_key

        # If room host skips song
        if room.host == user:
            response = skip_next_song(user,room_code=room_code, is_host=True)
            return Response(response, status=status.HTTP_200_OK)
    
        # If member skips the song
        response = skip_next_song(user,room_code=room_code, is_host=False)
        print(response)
        return Response(response, status=status.HTTP_200_OK)
    
class SkipPreviousSong(APIView):
    permission_classes = []
    authentication_classes= []

    def post(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)[0]

        user= self.request.session.session_key

        if room.host != user:
            response = skip_previous_song(user, room_code)
            return Response(response, status=status.HTTP_200_OK)
        
        else:
            response = skip_previous_song(user, room_code)
            return Response(response, status = status.HTTP_200_OK)