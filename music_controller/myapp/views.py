from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse


# Create your views here.
def main(request):
    return HttpResponse("<h1>hello</h1>Hello")

class RoomView(generics.CreateAPIView):
    queryset=Room.objects.all()
    serializer_class=RoomSerializer

class CreateRoom(APIView):
    serializer_class = CreateRoomSerializer

    #Removes authentication
    authentication_classes = []
    permission_classes = []

    def post(self, request, format=None):
        print("save clicked")
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        # checks if the data matches with the serializer rules
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            querySet= Room.objects.filter(host=host)
            if querySet.exists():
                room = querySet[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                self.request.session['room_code'] = room.code
                room.save(update_fields = ['guest_can_pause','votes_to_skip'])

                #returns the data in Json format
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

            else:
                room = Room(host=host,guest_can_pause=guest_can_pause,votes_to_skip=votes_to_skip)
                self.request.session['room_code'] = room.code
                room.save()

                #returns the data in Json format
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

class GetRoom(APIView) :
    serializer_class = RoomSerializer
    # fetches the roomCode from the url
    lookup_url_kwarg = 'roomCode'

    def get(self, request, format=None) :
        roomCode = request.GET.get(self.lookup_url_kwarg)
        if roomCode is not  None :
            room = Room.objects.filter(code=roomCode)
            if room.exists() :
                data = RoomSerializer(room[0]).data
                if self.request.session.session_key == room[0].host :
                    data['is_host'] = True
                else :
                    data['is_host'] = False
                return Response(data, status=status.HTTP_200_OK)

            return Response({'Room Not Found' : 'Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)                

        return Response({'Bad Request' : 'Code not Found '}, status = status.HTTP_400_BAD_REQUEST)

class JoinRoom(APIView) :
    authentication_classes = []
    permission_classes = []

    lookup_url_kwarg = "roomCode"
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        roomCode = request.data.get(self.lookup_url_kwarg)
        print(roomCode)
        print("outside")
        if roomCode is not None:
            print("inside")
            room_result = Room.objects.filter(code=roomCode)
            if room_result.exists():
                room = room_result[0]
                self.request.session['room_code'] = room.code
                return Response({'roomCode' : roomCode},status=status.HTTP_200_OK)
            
            return Response({'Room Not Found' : "Invalid Room Code"}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({"Bad Request" : "Invalid Data"}, status=status.HTTP_400_BAD_REQUEST)

class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        data= {
            'room_code' : self.request.session.get('room_code')
        }
        print(data)
        return JsonResponse(data, status=status.HTTP_200_OK)

class LeaveRoom(APIView):
    authentication_classes = []
    permission_classes = []

    print("hello")
    
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        if "room_code" in self.request.session:
            print("inside")
            self.request.session.pop("room_code")
            host_id = self.request.session.session_key
            is_host = Room.objects.filter(host=host_id)
            if is_host:
                room=is_host[0]
                room.delete()

            return Response({"message" : "Sucessfully left the room"}, status=status.HTTP_200_OK)
        return Response({"Bad Request" : "Invalid Data"}, status=status.HTTP_400_BAD_REQUEST)

class UpdateRoom(APIView):

    authentication_classes = []
    permission_classes = []

    serializer_class = UpdateRoomSerializer
    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid() :
            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = serializer.data.get("votes_to_skip")
            code = serializer.data.get("code")

            query_set = Room.objects.filter(code=code)
            if not query_set.exists() :
                return Response({"Not Found" : "Room not found"}, status=status.HTTP_404_NOT_FOUND)

            room = query_set[0] 
            user_id = self.request.session.session_key
            if room.host != user_id :
                return Response({"Unauthorized" : "You are not the Host"}, status=status.HTTP_403_FORBIDDEN)

            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=['guest_can_pause','votes_to_skip'])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

