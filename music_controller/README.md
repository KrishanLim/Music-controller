# House Music

A collaborative music room web app where a host connects their Spotify account and guests in the same room can view the currently playing song, vote to skip, and (if permitted) play/pause playback.

Built as a learning project with a **Django REST** backend and a **React + Material UI** frontend served from a single Django app.

## Features

- Create a room with a unique 6-character code
- Join a room as a guest using its code
- Host configures room settings: votes required to skip, whether guests may pause
- Spotify OAuth authentication for the host
- Live "now playing" card (title, artist, album art, progress, play/pause state) polled from Spotify
- Play / pause / skip controls with vote-to-skip logic
- Settings page to update room options after creation

## Tech Stack

- **Backend:** Django 6, Django REST Framework, SQLite
- **Frontend:** React 19, React Router 7, Material UI 5, Webpack 5, Babel
- **External API:** Spotify Web API (OAuth + Player endpoints)

## Project Structure

```
music_controller/
├── manage.py
├── music_controller/        # Django project settings/urls
├── myapp/                   # Room model + room API (create, join, settings)
├── spotify/                 # Spotify OAuth, token storage, player endpoints
└── frontend/                # Django app serving the React SPA
    ├── src/components/      # React components (HomePage, Room, MusicPlayer, Info, ...)
    ├── static/frontend/     # Webpack bundle output
    └── templates/frontend/  # index.html entry template
```

## Prerequisites

- Python 3.12+
- Node.js 18+ and npm
- A Spotify Developer application (Client ID + Client Secret)

## Setup

### 1. Backend

```bash
pip install django djangorestframework requests
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev      # webpack --watch for development
# or
npm run build    # production bundle
```

The Django dev server serves the bundled JS from `frontend/static/frontend/main.js`.

### 3. Spotify credentials

Create `spotify/credentials.py` (gitignored) with:

```python
CLIENT_ID = "your-spotify-client-id"
CLIENT_SECRET = "your-spotify-client-secret"
REDIRECT_URI = "http://127.0.0.1:8000/spotify/redirect"
```

Add the same `REDIRECT_URI` to your Spotify Developer dashboard's app settings.

## Usage

1. Visit `http://127.0.0.1:8000/`
2. Click **Create a Room**, pick settings, and authenticate with Spotify when prompted
3. Share the room code with guests
4. Guests open the home page → **Join a Room** → enter the code
5. Start a track on Spotify; the room's MusicPlayer will pick it up and display controls

## API Overview

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/create-room` | POST | Create a new room |
| `/api/join-room` | POST | Join an existing room by code |
| `/api/get-room?code=XXXX` | GET | Fetch room details |
| `/api/update-room` | PATCH | Update room settings (host only) |
| `/api/user-in-room` | GET | Check the session's current room |
| `/api/leave-room` | POST | Leave / close the room |
| `/spotify/get-auth-url` | GET | Get Spotify OAuth URL |
| `/spotify/redirect` | GET | OAuth callback |
| `/spotify/is-authenticated` | GET | Check if host is authenticated |
| `/spotify/current-song` | GET | Currently playing track |
| `/spotify/play` `/pause` `/skip` | PUT/POST | Playback controls |
