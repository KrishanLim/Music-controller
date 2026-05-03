from django.urls import path
from . import views


urlpatterns = [
    path('', views.RoomView.as_view()),
    path('create_room/',views.CreateRoom.as_view())
]