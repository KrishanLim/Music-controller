import React, { useState,useEffect } from "react";
import { Grid, Typography, Button, IconButton } from "@mui/material";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNext from '@mui/icons-material/NavigateNext';
import { Link } from "react-router-dom";

const pages = {
    JOIN : "pages.join",
    CREATE : "pages.create",
    ROOM : "pages.room"
}

export default function Info(props){

    const [page, setPage] = useState(pages.JOIN);

    function joinInfo() {
        return (
        <Grid item xs={12} align="center">
            <Typography component="h4" variant="h4" sx={{ fontWeight: "bold" }}>
                Join Page
            </Typography>
            <Typography component="h6" variant="body1">
                Join a room created by your friends.<br/>
                You can join the room using the room code.<br/>
                Enjoy!
            </Typography>
        </Grid>);
    }

    function createInfo() {
        return (
        <Grid item xs={12} align="center">
            <Typography component="h4" variant="h4" sx={{ fontWeight: "bold" }}>
                Create Page
            </Typography>
            <Typography component="h6" variant="body1">
                Create a Room and Invite your friends to join.<br/>
                You can customize the room settings to your liking.<br/>
                Users can join the room using the room code.<br/>
                Start playing!
            </Typography>
        </Grid>);
    }


    // Runs everytime the page is rerendered or updated and returned when the page is unmounted
    useEffect(() => {
        console.log("Info page");
        return () => {console.log("Info page unmounted");};
    })

    return(
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    What is House Music?
                </Typography>
            </Grid> 
            <Grid item xs={12} align="center">    
                    { page == pages.CREATE ? joinInfo() : createInfo() }
                <IconButton onClick = {() =>(page == pages.CREATE) ? setPage(pages.JOIN) 
                    : setPage(pages.CREATE)}>
                        { page == pages.CREATE ? <NavigateBeforeIcon/> : <NavigateNext/> }
                </IconButton>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" component={Link} to="/">Back</Button>
            </Grid>
        </Grid>
    );
}
