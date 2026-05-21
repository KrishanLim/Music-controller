from decouple import config

CLIENT_ID = "0dc78e7e535d471b82edcd64c7902016"
CLIENT_SECRET = config("CLIENT_SECRET")

REDIRECT_URI = "http://127.0.0.1:8000/spotify/spotify-callback/"