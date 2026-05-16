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
        this.state = {
            song : this.props.song
        };
        console.log(this.state.song);    
    }
    

    render() {
        return (
            <Card>
                <Grid container align='center'>
                    <Grid item align='center' xs={4}>
                        <img src={this.state.song.image} height='100%' width='100%'/>
                    </Grid>
                </Grid>
            </Card>
        );
    }

}

export default function MusicPlayerWrapper(props) {
    return <MusicPlayer {...props}/>;
}