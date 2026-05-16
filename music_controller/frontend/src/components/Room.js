import React, { Component, useState, useEffect } from 'react';
import { Grid, Typography, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import CreateRoomPageWrapper from "./CreateRoomPage";
import HomePageWrapper from "./HomePage"
import MusicPlayerWrapper from "./MusicPlayer";

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: null,
            guestCanPause: null,
            isHost: null,
            eror: null,
            settings : false,
            spotifyAuthenticated : false,
            song : {}
        };
        this.getRoomDetails();
        this.handleGoBackButton = this.handleGoBackButton.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.getCurrentSong = this.getCurrentSong.bind(this);
        this.renderMusicPlayer = this.renderMusicPlayer.bind(this);
    }

    componentDidMount() {
        this.interval = setInterval(this.getCurrentSong, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getRoomDetails() {
        const navigate = this.props.navigate;
        fetch('/api/room' + "?roomCode=" + this.props.roomCode)
        .then((response) => {
            if (!response.ok) {
                navigate("/");
                return null;
            }
            return response.json();
        })
        .then((data) => {
            if (!data) {
                return;
            }
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host
            });
            if (data.is_host) {
                this.authenticateSpotify();
            }
        });
    }

    authenticateSpotify() {
        fetch('/spotify/is-authenticated/')
        .then((response) => response.json())
        .then((data) => {
            this.setState({
                spotifyAuthenticated : data.status
            });
            if(!data.status) {
                console.log(data);
                fetch('/spotify/get-auth-url/')
                .then((response) => response.json())
                .then((data) => {
                    window.location.replace(data.url);
                });
            }
        })
        .catch((err) => console.log(err));
    }

    getCurrentSong() {
        fetch('/spotify/current-song/')
        .then((response) => {
            if (!response.ok) {
                return {};
            }
            else {
                return response.json();
            }
        }).then((data) => {
            this.setState({
                song : data
            });
            console.log(data.success);
        });
    }

    handleGoBackButton () {
        const navigate = this.props.navigate;
        const requestOptions = {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
        }
        fetch('/api/leave_room',requestOptions)
        .then(() => {
            navigate("/")
        });
        console.log("Left the room");
    }

    handleSettings(value) {
        console.log(this.state.spotifyAuthenticated);
        this.setState({
            settings: value
        });
    }

    renderSettingsButton() {
        // const settingsLink = "/room/" + this.props.roomCode + "/settings";
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={() => this.handleSettings(true)}>Settings
                </Button>
            </Grid>
        );
    }

    renderSettings() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPageWrapper
                        update={true}
                        votesToSkip={this.state.votesToSkip}
                        guestCanPause={this.state.guestCanPause}
                        roomCode={this.props.roomCode}
                        updateCallback={() => {this.getRoomDetails()}}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={() =>this.handleSettings(false)}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    }

    renderMusicPlayer() {
        return (
                <MusicPlayerWrapper song={this.state.song}/>
        );
    }

    render() {
        if(this.state.settings === true) {
            return this.renderSettings();
        }
        return (
            <Grid container spacing ={1}>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        Room Code : {this.props.roomCode}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    {this.renderMusicPlayer()}
                </Grid>
                {(this.state.isHost === true) && (
                    this.renderSettingsButton()
                )}
                <Grid item xs={12} align="center">
                    <Button variant="contained" color ="secondary" onClick={this.handleGoBackButton}>Go Back</Button>
                </Grid>
            </Grid>
        )
    }
}

export default function RoomWrapper() {
    // Reads roomCode from the URL using the useParams hook
    const navigate = useNavigate();
    const { roomCode } = useParams();
    // Calling the Room component in line 4 and passing the {roomCode} to an argument roomCode
    return <Room roomCode={roomCode} navigate={navigate}/>;
}