import React, { Component } from "react";
import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage";
import Room from "./Room";
import { BrowserRouter as Router, Routes, Route, Link, Redirect } from "react-router-dom";
import Button from "@mui/material/Button";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={
                        <div>
                                <p>This is The Home Page</p>
                                <Button variant="contained" color="primary" component={Link} to="/create">Create Room</Button>
                                <Button variant="contained" color="primary" component={Link} to="/join">Join Room</Button>
                        </div>
                        }></Route>
                        {/* The <RoomJoinPage/>, <CreateRoomPage/> and <Room/> are just alias and can be called anything */}
                    <Route path="/join" element={<RoomJoinPage/>}></Route>
                    <Route path="/create" element={<CreateRoomPage/>}></Route>
                    <Route path="/room/:roomCode" element={<Room/>}></Route>
                </Routes>
            </Router>
        );
    }
}