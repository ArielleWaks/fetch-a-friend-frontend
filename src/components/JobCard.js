import { Avatar, Card, CardContent, CardHeader, Grid, IconButton, Typography, Button, CardActions } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { useNavigate } from "react-router-dom";
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';


export default function JobCard ({ jobObject, id, deleteCallback, deleteEnabled, editEnabled, acceptEnabled, bookmarkEnabled }) {

  const API_URL = "http://localhost:3000/api";
  
  const navigate = useNavigate();

  const handleBookmark = () => {
    alert("Job Bookmarked!");
  };

  const handleAcceptJob = (id, _e) => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const response = fetch(API_URL + '/jobs/sitter/' + id, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + user.accessToken,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 401) {
        localStorage.removeItem("user");
        navigate('/login');
      }
      navigate('/jobs/mysitting');
    } catch (error) {
      console.log(error);
    }
  }

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
      console.log(error);
    }
  }

  const animalIcon = (jobObject) =>{
    if (jobObject.chosenAnimalType === "Dog"){return "/favavatar.jpeg"}
    else if(jobObject.chosenAnimalType === "Cat"){return "/Cat-icon_30345.png"}
    else if(jobObject.chosenAnimalType === "Fish"){return "/fish_icon.png"}
    else if(jobObject.chosenAnimalType === "Bird"){return "/bird_icon.png"}
    else if(jobObject.chosenAnimalType === "Lizard"){return "/lizard_icon.png"}
  }

  return (
    <Card variant="outlined" >
      <CardHeader
        avatar={
          <Avatar src={animalIcon(jobObject)}/>
        }
        title={<Typography variant="body2">Looking for a {jobObject.chosenAnimalType} sitter</Typography>}
        subheader={jobObject.zipCode}
        action={
          <React.Fragment>
            {deleteEnabled &&
              <IconButton onClick={(e) => handleDelete(jobObject.id, e)}>
                <DeleteIcon/>
              </IconButton>
            }
            {bookmarkEnabled &&
              <IconButton onClick={handleBookmark}>
                <BookmarkAddIcon/>
              </IconButton>
            }
          </React.Fragment>
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
          { editEnabled &&
            <Grid item xs={6}>
              <Typography variant="body2">{"Job Status:" + jobObject.jobStatus.replace("STATUS_", " ")}</Typography>
            </Grid>
          }
          { Object.is(jobObject.jobStatus, "STATUS_CLAIMED") && editEnabled &&
            <Grid item xs={6}>
              <Typography variant="body2">{"Pet Sitter: " + jobObject.sitter.username }</Typography>
            </Grid>
          }
        </Grid>
      </CardContent>
      <CardActions disableSpacing>
        { editEnabled && Object.is(jobObject.jobStatus, "STATUS_OPEN") &&
          <Button size="small" variant="outlined" onClick={() => navigate('/jobs/edit/' + jobObject.id)} >
            Edit
          </Button>
        }
        { acceptEnabled &&
          <Button size="small" variant="contained" onClick={(e) => handleAcceptJob(jobObject.id, e)} >
            Accept Job
          </Button>
        }
      </CardActions>
    </Card>
  )
}