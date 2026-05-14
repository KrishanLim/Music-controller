import React, { Component } from "react";
import { Button,
    Grid,
    Collapse,
    Typography, 
    TextField, 
    FormHelperText, 
    FormControl, 
    Radio, 
    RadioGroup, 
    FormControlLabel,
    Alert 
} from "@mui/material";
import { Link, 
    useNavigate 
} from "react-router-dom";

class CreateRoomPage extends Component {
    static defaultProps = {
        votesToSkip : 2,
        guestCanPause : true,
        update : false,
        roomCode : null,
        updateCallback :() => {}
    }

    constructor(props) {
        super(props);
        this.state = {
            guestCanPause : this.props.guestCanPause,
            votesToSkip : this.props.votesToSkip,
            successMsg : null,
            errorMsg : null,
        };
        this.handleCreateRoomClick = this.handleCreateRoomClick.bind(this);
        this.handleVotesToSkipChange = this.handleVotesToSkipChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.buttons = this.buttons.bind(this);
        this.saveSettingsClick = this. saveSettingsClick.bind(this);
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
        console.log(this.state.guestCanPause);
    }

    handleCreateRoomClick() {
        const navigate = this.props.navigate;
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
        .then((data) => navigate("/room/" + data.code));
        console.log(this.props.update);
    }

    saveSettingsClick() {
        const requestOptions = {
            method : "PATCH",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({
                votes_to_skip : this.state.votesToSkip,
                guest_can_pause : this.state.guestCanPause,
                code : this.props.roomCode
            })
        }
        fetch("/api/update_room",requestOptions)
        .then((response) => {
            if (response.ok) {
                this.setState({
                    successMsg : "Room updated successfully!"
                });
                this.props.updateCallback();
            }
            else {
                this.setState({
                    errorMsg : "Error updating room..."
                });
            }
            this.props.updateCallback()
        }).catch((err) => console.log(err));
    }

    buttons() {
        if (this.props.update) {
            return (
                <Button 
                    color="primary" 
                    variant="contained"
                    onClick = {this.saveSettingsClick}
                >Save settings
                </Button>
            );
        }
        return (
            <Grid container spacing ={1}>
                    <Grid item xs={12}>
                    <Button 
                    color="primary" 
                    variant="contained"
                    onClick = {this.handleCreateRoomClick}
                >Create Room
                </Button>
                </Grid>
                
                <Grid item xs={12}>
                        <Button color="secondary" variant="contained" to="/" component={ Link }>Back</Button>
                </Grid>
            </Grid>  
        );
    }
    
    render() {
        const title = this.props.update ? "Settings" : "Create A Room";
        return ( //Grid allows you to place items in rows and columns
            <Grid container spacing={1} direction="column" textAlign="center">
                <Grid item xs={12} align="center">
                    <Collapse in= {this.state.errorMsg !== null || this.state.successMsg !== null}>
                        {(this.state.errorMsg !== null) ?
                            <Alert severity="error"
                                onClose = {() =>{
                                    this.setState({
                                        errorMsg : null
                                    });
                                }}
                            >{this.state.errorMsg}
                            </Alert>
                        :
                            <Alert severity="success"
                                onClose = {() =>{
                                    this.setState({
                                        successMsg : null
                                    });
                                }}
                            >{this.state.successMsg}</Alert>
                        }
                    </Collapse>
                </Grid>
                <Grid item xs={12}>
                    {/* //Typography is a text component */}
                    <Typography component="h4" variant="h4">
                        {title}
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
                            row value={String(this.state.guestCanPause)}
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
                            defaultValue={this.state.votesToSkip}
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
                    {this.buttons()}
                </Grid>                 
            </Grid>
        );
    }
}

export default function CreateRoomPageWrapper(props) {
    const navigate = useNavigate();
    return <CreateRoomPage navigate={navigate} {...props}/>;
}