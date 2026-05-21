import React, { Component } from "react";
import { Grid, Typography, Card, IconButton, LinearProgress } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PauseIcon from "@mui/icons-material/Pause";

class MusicPlayer extends Component {
    static defaultProps = {
        song : {},
    }

    constructor(props){
        super(props);
        console.log('Musicc Player');    
        this.handlePauseClick = this.handlePauseClick.bind(this);
        this.handlePlayClick = this.handlePlayClick.bind(this);
        this.handleSkpiNextClick = this.handleSkipNextClick.bind(this);
        this.handleSkipPreviousClick = this.handleSkipPreviousClick.bind(this);
    }
    
    handlePauseClick() {
        const requestOptions = {
            method : "PUT",
            headers : {"Content-Type" : "application/json"},
        }
        fetch('/spotify/pause-song/',requestOptions);
    }

    handleSkipPreviousClick() {
        const requestOptions = {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
        }

        fetch('/spotify/skip-previous-song/', requestOptions);   
    }

    handleSkipNextClick() {
        const requestOptions = {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
        }

        fetch('/spotify/skip-next-song/', requestOptions)
        .then((response)=> console.log(response));
    }

    handlePlayClick() {
        const requestOptions = {
            method : "PUT",
            headers : {"Content-Type" : "application/json"},
        }
        fetch('/spotify/play-song/',requestOptions);
    }

    render() {
        const progress = (this.props.song.time/this.props.song.duration) *100
        return (
            <Card square>
                <Grid container alignItems='center'>
                    <Grid item align='center' xs={4}>
                        <img src={this.props.song.image_url} height='100%' width='100%'/>
                    </Grid>
                        <Grid item align='center' xs={8} direction='column'>
                            <Grid item align='center' xs={8}>
                                <Typography variant='h4' component='h4'>
                                    {this.props.song.title}
                                </Typography>
                                <Typography variant='subtitle1' color="textSecondary">
                                    {this.props.song.artist}
                                </Typography>
                            </Grid>
                            <Grid item alignItems='center'>
                                <div>
                                    <IconButton onClick = {() => this.handleSkipPreviousClick()}>
                                        <SkipPreviousIcon/>
                                    </IconButton>
                                    <IconButton
                                            onClick = {() => {(this.props.song.is_playing) ? this.handlePauseClick() : this.handlePlayClick()}}
                                        >
                                        {this.props.song.is_playing ? 
                                        <PauseIcon /> 
                                        : <PlayArrowIcon/>
                                        }
                                    </IconButton>
                                    <IconButton onClick = {() => this.handleSkipNextClick()}>
                                        <SkipNextIcon/>
                                    </IconButton>
                                </div>
                                <Grid item align='center' xs={12}>
                                    <Typography variant='subtitle1' color="textSecondary">
                                        Votes: {this.props.song.votes}/{this.props.song.votes_required}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item align='center' xs={12}>
                                <Grid item align='center' xs={6}>
                                        <LinearProgress variant="determinate" value= {progress}/>
                                </Grid>
                            </Grid>
                    </Grid>
                </Grid>
            </Card>
        );
    }

}

export default function MusicPlayerWrapper(props) {
    return <MusicPlayer {...props}/>;
}