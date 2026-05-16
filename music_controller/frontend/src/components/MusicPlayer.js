import React, { Component } from "react";
import { Grid, Typography, Card, IconButton, LinearProgress } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
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
    }
    
    handlePauseClick() {
        const requestOptions = {
            method : "PUT",
            headers : {"Content-Type" : "application/json"},
        }
        fetch('/spotify/pause-song/',requestOptions);
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
                        <Grid item align='center' xs={4} direction='column'>
                            <Grid item align='center' xs={4}>
                                <Typography variant='h4' component='h4'>
                                    {this.props.song.title}
                                </Typography>
                                <Typography variant='subtitle1' color="textSecondary">
                                    {this.props.song.artist}
                                </Typography>
                            </Grid>
                            <Grid item align='center' xs={4}>
                                <div>
                                    <Grid item align='center' xs={12}>
                                        <IconButton
                                            onClick = {() => {(this.props.song.is_playing) ? this.handlePauseClick() : this.handlePlayClick()}}
                                        >
                                        {this.props.song.is_playing ? 
                                        <PauseIcon /> 
                                        : <PlayArrowIcon/>
                                        }
                                        </IconButton>
                                    </Grid>
                                    <Grid item align='center' xs={12}>
                                        <IconButton>
                                        <SkipNextIcon/>
                                        </IconButton>
                                    </Grid>
                                </div>
                            </Grid>
                            <Grid item align='center' xs={12}>
                                <LinearProgress variant="determinate" value= {progress}/>
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