import React, { Component } from 'react';
import { useParams } from "react-router-dom";

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
    }

    getRoomDetails() {
        fetch('/api/room' + "?roomCode=" + this.props.roomCode)
        .then((response) => {
            if (!response.ok) {
                return response.json().then((data)=>{
                    throw new Error(Object.values(data)[0]);
                });
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

    render() {
        // this.props is universal and can be used in any component
        const { roomCode } = this.props;
        if (this.state.error) {
            return (
                <div><p>{this.state.error}</p></div>
                
            );
        }

        else if (this.state.votesToSkip == null) {
                <div>
                    <p>Loading...</p>
                </div>
        }

        else {
            return (
                <div>
                    <p>Room Code : {roomCode}</p>
                    <p>
                        Votes to skip : {this.state.votesToSkip}
                    </p>
                    <p>
                        Guest can Pause : {String(this.state.guestCanPause)}
                    </p>
                    <p>
                        Host : {String(this.state.isHost)}
                    </p>
                </div>
            );
        }
        
    }
}

export default function RoomWrapper() {
    // Reads roomCode from the URL using the useParams hook
    const { roomCode } = useParams();
    // Calling the Room component in line 4 and passing the {roomCode} to an argument roomCode
    return <Room roomCode={roomCode} />;
}