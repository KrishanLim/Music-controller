from django.urls import path
from . import views


urlpatterns = [
    path('', views.RoomView.as_view()),
    path('create_room/',views.CreateRoom.as_view()),
    path('room/',views.GetRoom.as_view()),
    path('join',views.JoinRoom.as_view()),
    path('user_in_room',views.UserInRoom.as_view())
]