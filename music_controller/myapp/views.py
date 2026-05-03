from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response


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
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            querySet= Room.objects.filter(host=host)
            if querySet.exists():
                room = querySet[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields = ['guest_can_pause','votes_to_skip'])

                #returns the data in Json format
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

            else:
                room = Room(host=host,guest_can_pause=guest_can_pause,votes_to_skip=votes_to_skip)
                room.save()

                #returns the data in Json format
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

                

