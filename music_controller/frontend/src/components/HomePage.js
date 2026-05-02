import React, { Component } from "react";
import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage";
import { BrowserRouter as Router, Routes, Route, Link, Redirect } from "react-router-dom";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<p>This is The Home Page</p>}></Route>
                    <Route path="/join" element={<RoomJoinPage/>}></Route>
                    <Route path="/create" element={<CreateRoomPage/>}></Route>
                </Routes>
            </Router>
        );
    }
}