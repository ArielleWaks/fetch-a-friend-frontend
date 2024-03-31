import {Avatar, Card, CardContent, CardHeader, Grid, IconButton, Typography} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import EventBus from "../common/EventBus";


export default function JobCard ({ jobObject, id, deleteCallback }) {
  
  const API_URL = "http://localhost:3000/api";
  
  const handleDelete = (id, _e) => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      fetch(API_URL + '/jobs/' + id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + user.accessToken,
          'Content-Type': 'application/json'
        }
      });
      deleteCallback(id);
    } catch (error) {
      const errorMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(errorMessage);
      if (error.response && error.response.status === 401) {
        EventBus.dispatch("logout");
      }
    }
  }
  
  return (
    <Card variant="outlined" >
      <CardHeader
        avatar={
          <Avatar src="/favavatar.jpeg"/>
        }
        title={jobObject.description}
        subheader={jobObject.startDate + " to " + jobObject.endDate}
        action={
          <IconButton onClick={(e) => handleDelete(jobObject.id, e)}>
            <DeleteIcon/>
          </IconButton>
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2">{"Start Date: " + jobObject.startDate}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">{"End Date: " + jobObject.endDate}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">{"Pay Rate: $" + jobObject.payRate}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">{"Hours: " + jobObject.totalHours}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}