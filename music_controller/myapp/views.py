from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import generics
from .serializers import RoomSerializer
from .models import Room

# Create your views here.
def main(request):
    return HttpResponse("<h1>hello</h1>Hello")

class RoomView(generics.CreateAPIView):
    queryset=Room.objects.all()
    serializer_class=RoomSerializer