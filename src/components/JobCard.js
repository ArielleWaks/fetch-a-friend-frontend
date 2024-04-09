import { Avatar, Card, CardContent, CardHeader, Grid, IconButton, Typography, Button, CardActions } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import EventBus from "../common/EventBus";
import { useNavigate } from "react-router-dom";


export default function JobCard ({ jobObject, id, deleteCallback, deleteEnabled, editEnabled }) {
  
  const API_URL = "http://localhost:3000/api";
  
  const navigate = useNavigate();
  
  const handleDelete = (id, _e) => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const response = fetch(API_URL + '/jobs/' + id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + user.accessToken,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 401) {
        localStorage.removeItem("user");
        navigate('/login');
      }
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
        title={jobObject.chosenAnimalType}
        subheader={jobObject.zipCode}
        action={ deleteEnabled &&
          <IconButton onClick={(e) => handleDelete(jobObject.id, e)}>
            <DeleteIcon/>
          </IconButton>
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2">{jobObject.description}</Typography>
          </Grid>
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
      <CardActions disableSpacing>
        { editEnabled &&
          <Button size="small" onClick={() => navigate('/jobs/edit/' + jobObject.id)} >Edit</Button>
        }
      </CardActions>
    </Card>
  )
}