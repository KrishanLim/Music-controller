import React, { Component } from "react";
import { createRoot } from "react-dom/client";

export default class App extends Component {
    render() {
        return <h1>Hello this is testing.....</h1>
    }
}

const appDiv = document.getElementById("app");
createRoot(appDiv).render(<App />);