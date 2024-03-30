import React, { useEffect, useState } from "react";
import { Avatar, Card, CardContent, CardHeader, Container, Grid, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import EventBus from "../common/EventBus";

const API_URL = "http://localhost:3000/api";

export default function BrowseJobs () {
  const [jobArray, setJobArray] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(API_URL + '/jobs', {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const json = await response.json()
        setJobArray(json);
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
    
    fetchData();
  }, []);
  
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
      setJobArray(jobArray.filter((job) => (job.id !== id)));
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
    <Container>
      <Typography varient="h1">
        Browse Open Jobs
      </Typography>
      {jobArray.map((field, id) => {
        return (
          <Card variant="outlined" key={id}>
            <CardHeader
              avatar={
                <Avatar src="favavatar.jpeg"/>
              }
              title={field.description}
              subheader={field.startDate + " to " + field.endDate}
              action={
                <IconButton onClick={(e) => handleDelete(field.id, e)}>
                  <DeleteIcon/>
                </IconButton>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2">{"Start Date: " + field.startDate}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{"End Date: " + field.endDate}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{"Pay Rate: $" + field.payRate}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{"Hours: " + field.totalHours}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )
      })}
    </Container>
  );
};