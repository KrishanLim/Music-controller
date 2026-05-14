import React, { Component, useState, useEffect } from 'react';
import { Grid, Typography, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import CreateRoomPageWrapper from "./CreateRoomPage";

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: null,
            guestCanPause: null,
            isHost: null,
            eror: null,
            settings : false
        };
        this.getRoomDetails();
        this.handleGoBackButton = this.handleGoBackButton.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
    }

    getRoomDetails() {
        const navigate = this.props.navigate;
        fetch('/api/room' + "?roomCode=" + this.props.roomCode)
        .then((response) => {
            if (!response.ok) {
                navigate("/");
            }
            return response.json();
        })
        .then((data) => {
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host
            });
        })
        .catch((err) => {
            this.setState({
                error: err.message
            });
            console.log(err);
        });
    }

    handleGoBackButton () {
        const navigate = this.props.navigate;
        const requestOptions = {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
        }
        fetch('/api/leave_room',requestOptions);
        navigate("/");
        console.log("Left the room");
    }


    handleSettings(value) {
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
                    <Typography component="h6" variant="h6">
                        Votes to skip : {this.state.votesToSkip}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h6" variant="h6">
                        Guest can Pause : {String(this.state.guestCanPause)}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h6" variant="h6">
                        Host : {String(this.state.isHost)}
                    </Typography>
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