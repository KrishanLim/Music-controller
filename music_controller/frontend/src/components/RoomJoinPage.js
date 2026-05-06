import React, { Component } from "React";
import { TextField, Button, Grid, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

class RoomJoinPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: "",
            error: ""
        };
        this.handleRoomCodeChange = this.handleRoomCodeChange.bind(this);
        this.handleJoinButtonClick = this.handleJoinButtonClick.bind(this);
    }

    render() {
        return (
            <Grid container spacing = {1} direction = "column" textAlign = "center">
                <Grid item xs = {12} textAlign="center">
                    <Typography component="h4" variant="h4">
                        Join A Room
                    </Typography>
                </Grid>
                <Grid item xs = {12} textAlign="center">
                    <TextField
                    variant = "outlined"
                    error = {this.state.error}
                    label = "Code"
                    placeholder = "Enter A Room Code"
                    value = {this.state.roomCode}
                    helperText = {this.state.error}
                    onChange = {this.handleRoomCodeChange}
                    inputProps = {{
                        style: {
                            textAlign : "center"
                        }
                    }}
                    />
                </Grid>
                <Grid item xs ={12} textAlign="center">
                        <Button variant = "contained" color="primary" onClick={this.handleJoinButtonClick}>Join</Button>
                </Grid>
                <Grid item xs ={12} textAlign="center">
                        <Button variant = "contained" color="secondary" component = {Link} to = "/">Back</Button>
                </Grid>

            </Grid>
        );
    }

    handleRoomCodeChange(e) {
        this.setState({
            roomCode: e.target.value
        });
    }

    handleJoinButtonClick() {
        const navigate = this.props.navigate;
        const requestOptions = {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({
                roomCode : this.state.roomCode
            }),
        };
        fetch("/api/join",requestOptions)
        .then((response) => {
            if (response.ok) {
                navigate("/room/" + this.state.roomCode);
            }
            else {
                this.setState({
                    error: "Room Not Found"
                });
            }
        }).catch((err) => console.log(err.message));
    }
}

export default function RoomJoinWrapper() {
    const navigate = useNavigate();
    return <RoomJoinPage navigate={navigate}/>
}