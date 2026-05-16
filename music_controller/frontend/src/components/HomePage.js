import React, { Component } from "react";
import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage";
import Room from "./Room";
import MusicPlayer from "./MusicPlayer";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Button, Grid, ButtonGroup, Typography } from "@mui/material";

class HomePage extends Component {

    static defaultProps ={
        roomCode : null
    }

    constructor(props) {
        super(props);
        this.state = {
            roomCode: this.props.roomCode
        };
    }

    async componentDidMount() {
        fetch("/api/user_in_room")
        .then((response) => response.json())
        .then((data) => {
            this.setState({
                roomCode: data.room_code
            });
            console.log(data);
        });
    }

    renderHomePage() {
        return(
            <Grid container spacing={1} direction="column">
                <Grid item xs={12} textAlign="center">
                    <Typography component="h4" variant="h4">
                        House Music
                    </Typography>
                </Grid>
                <Grid item xs={12} textAlign="center">
                    <ButtonGroup disableElevation variant='contained' color="primary">
                        <Button variant="contained" color="primary" component={Link} to="/create">Create Room</Button>
                        <Button variant="contained" color="secondary" component={Link} to="/join">Join Room</Button>  
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={
                        this.state.roomCode ? (<Navigate to= {`/room/${this.state.roomCode}`}/>):
                        this.renderHomePage()
                        }/>
                        {/* The <RoomJoinPage/>, <CreateRoomPage/> and <Room/> are just alias and can be called anything */}
                    <Route path="/join" element={<RoomJoinPage/>}></Route>
                    <Route path="/create" element={<CreateRoomPage/>}></Route>
                    <Route path="/room/:roomCode" element={<Room/>}></Route>
                </Routes>
            </Router>
        );
    }
}

export default function HomePageWrapper () {
    return <HomePage/>
}