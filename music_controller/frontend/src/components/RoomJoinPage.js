import React, { Component } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { Link } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

export default class RoomJoinPage extends Component {
    defaultVotes = 2;

    constructor(props) {
        super(props);
        this.state = {
            guestCanPause : true,
            votesToSkip : this.defaultVotes
        };
        this.handleCreateRoomClick = this.handleCreateRoomClick.bind(this);
        this.handleVotesToSkipChange = this.handleVotesToSkipChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
    }
    
    handleVotesToSkipChange(e) {
        this.setState({
            votesToSkip : e.target.value
        });
    }

    handleGuestCanPauseChange(e) {
        this.setState({
            // ? : acts as if statements like if( e.target.value === "true" ) then true or false
            guestCanPause : e.target.value === "true" ? true : false
        });
    }

    handleCreateRoomClick() {
        const requestOptions = {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause
            }),
        };
        fetch("/api/create_room/",requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));
    }

    render() {
        return ( //Grid allows you to place items in rows and columns
                <Grid container spacing={1} direction="column" textAlign="center">
                    <Grid item xs={12}>
                        {/* //Typography is a text component */}
                        <Typography component="h4" variant="h4">
                            Create A Room
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {/* //FormControl is used to group related form controls
                        //It is a wrapper for form inputs (like radios, text fields, selects) that helps them work together properly. */}
                        <FormControl component="fieldset">
                            {/* //Renders like a <p> but has extra MUI behavior */}
                            <FormHelperText>
                                    Guest Control of playback state
                            </FormHelperText>
                            {/* RadioGoup is used to group related radio buttons with it only one can be selected */}
                            <RadioGroup 
                                row defaultValue="true"
                                onChange = {this.handleGuestCanPauseChange}
                            >
                                {/* FormControlLabel is like a readymade radio button with label attached */}
                                <FormControlLabel 
                                    value="true" 
                                    control={<Radio color="primary"/>}
                                    label="Play/Pause"
                                    labelPlacement="bottom"
                                />
                                <FormControlLabel 
                                    value="false" 
                                    control={<Radio color="secondary"/>}
                                    label="No Control"
                                    labelPlacement="bottom"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} textAlign="center">
                        <FormControl>
                            {/* TextField is an input box where users can type text */}
                            <TextField 
                                required={true}
                                type="number"
                                defaultValue={this.defaultVotes}
                                onChange = {this.handleVotesToSkipChange}
                                inputProps={{
                                    min:1,
                                    style:{textAlign:"center"},
                                }} 
                            />
                            <FormHelperText>
                                Votes required to skip song
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} textAlign="center">
                        <Button 
                            color="primary" 
                            variant="contained"
                            onClick = {this.handleCreateRoomClick}
                        >Create Room</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button color="secondary" variant="contained" to="/" component={ Link }>Back</Button>
                    </Grid>
                </Grid>
        );
    }
}