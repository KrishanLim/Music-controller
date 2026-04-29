import React, { Component } from "react";
import CreateRoomPage from "./CreateRoomPage";
import RoomJoinPage from "./RoomJoinPage";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <switch>
                    <Route path="/"><p>This is The Home Page</p></Route>
                    <Route path="/join" component={RoomJoinPage}></Route>
                </switch>
            </Router>
        );
    }
}