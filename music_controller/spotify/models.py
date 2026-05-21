from django.db import models
from myapp.models import Room

# Create your models here.

class SpotifyToken(models.Model) :
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=150)
    access_token = models.CharField(max_length=150)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)

class Vote(models.Model) :
    user = models.CharField(max_length=50, unique = True)
    song_id = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add = True)
    # On deleting the (Room) object, will delete all (Vote) objects that is linked with (Room)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)