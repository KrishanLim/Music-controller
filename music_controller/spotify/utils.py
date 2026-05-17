from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get
from rest_framework import status

BASE_URL = "https://api.spotify.com/v1/me/"

def get_user_tokens(session_key):
    user_tokens = SpotifyToken.objects.filter(user=session_key)
    print(user_tokens)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def update_or_create_tokens(session_key, access_token, token_type, expires_in, refresh_token):
    user_tokens = get_user_tokens(session_key)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if user_tokens:
        user_tokens.access_token = access_token
        user_tokens.token_type = token_type
        user_tokens.expires_in = expires_in
        if refresh_token:
            user_tokens.refresh_token = refresh_token
        user_tokens.save(update_fields=['access_token','token_type','expires_in','refresh_token'])
    else:
        SpotifyToken.objects.create(user=session_key,access_token=access_token,token_type=token_type,expires_in=expires_in,refresh_token=refresh_token)

def check_user_is_authenticated(session_key):
    user_tokens = get_user_tokens(session_key)
    print(user_tokens)
    if not user_tokens:
        return False

    if user_tokens.expires_in < timezone.now():
        refresh_tokens(session_key)
    return True

def refresh_tokens(session_key):
    refresh_token=get_user_tokens(session_key).refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
            'grant_type': 'refresh_token',
            'refresh_token' : refresh_token,
            'client_id' : CLIENT_ID,
            'client_secret' : CLIENT_SECRET,
        }, timeout=5).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    update_or_create_tokens(session_key, access_token, token_type, expires_in, refresh_token )

def execute_spotify_api_request(session_key, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_key)
    header = {'Content-Type' : 'application/json', "Authorization" : "Bearer " + tokens.access_token}

    if post_:
        post(BASE_URL+endpoint, headers=header, timeout=5)
    if put_ :
        put(BASE_URL+endpoint, headers=header, timeout=5)
    response = get(BASE_URL+endpoint,{}, headers=header, timeout=5)
    try:
        return response.json()
    except:
        return {'error' : 'Error at spotify api request'}

def pause_song(session_key):
    endpoint = "player/pause"
    response = execute_spotify_api_request(session_key, endpoint, put_=True)
    return response

def play_song(session_key):
    endpoint = "player/play"
    response = execute_spotify_api_request(session_key, endpoint, put_=True)
    return response