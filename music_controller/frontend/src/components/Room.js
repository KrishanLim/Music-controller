import React, { Component } from 'react';
import { useParams } from "react-router-dom";
import { Grid, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: null,
            guestCanPause: null,
            isHost: null,
            eror: null
        };
        this.getRoomDetails();
        this.handleGoBackButton = this.handleGoBackButton.bind(this);
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

    render() {
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
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="primary" component={Link} to="/edit_room">Edit Room</Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color ="secondary" onClick={this.handleGoBackButton}>Go Back</Button>
                </Grid>
            </Grid>
        )
    }
}

export default function RoomWrapper() {
    // Reads roomCode from the URL using the useParams hook
    const navigate=useNavigate();
    const { roomCode } = useParams();
    // Calling the Room component in line 4 and passing the {roomCode} to an argument roomCode
    return <Room roomCode={roomCode} navigate={navigate} />;
}