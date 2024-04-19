import { Avatar, Card, CardContent, CardHeader, Grid, IconButton, Typography, Button, CardActions } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';
import { styled } from '@mui/system';
import animalAvatarSelector from "./functions/animalAvatarSelector";
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';


export default function JobCard ({ jobObject, id, deleteCallback, deleteEnabled, editEnabled, acceptEnabled, bookmarkEnabled }) {

  const API_URL = "http://localhost:3000/api";

  //Bookmark confirmation popup stuff
  const [anchor, setAnchor] = React.useState(null);
  const open = Boolean(anchor);
  const identification = open ? 'simple-popper' : undefined;


  const user = JSON.parse(localStorage.getItem('user'));
  let bookmarkChecker = false;
  for(let i = 0; i < jobObject.usersWhoBookmarked.length; i++){
    if (jobObject.usersWhoBookmarked[i].id === user.id){bookmarkChecker = true;}
  }

  const [isBookmarked, setIsBookmarked] = useState(bookmarkChecker);

/* const handleBookmarkClick = (event) => {
  setAnchor(anchor ? null : event.currentTarget);
  setTimeout(function() { 
    setAnchor(anchor ? null : event.currentTarget);
  }, 2000); 

}; */



const handleBookmarkClick = async (event) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const jobId = jobObject.id;
  const url = `${API_URL}/jobs/bookmark/${jobId}`;
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + user.accessToken,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {

      if(!isBookmarked){
        setAnchor(anchor ? null : event.currentTarget);
        setTimeout(function() { 
        setAnchor(anchor ? null : event.currentTarget);
        }, 2000); 
        setIsBookmarked(!isBookmarked);
        
      }
    } else if (response.status === 401) {
      localStorage.removeItem("user");
      navigate('/login');
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
  
  const navigate = useNavigate();

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


  //This function selects what the avatar is based on the chosenAnimalType string in the Job.
  const animalIcon = animalAvatarSelector(jobObject);

  return (
    <Card variant="outlined" >
      <CardHeader
        avatar={
          <Avatar src={animalIcon}/>
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
            <div>
                <IconButton onClick={handleBookmarkClick}>
                {isBookmarked ? <BookmarkAddedIcon /> : <BookmarkAddOutlinedIcon />}
                </IconButton>
                <BasePopup id={identification} placement="top" open={open} anchor={anchor}>
                <PopupBody>Job Bookmarked!</PopupBody></BasePopup>
              </div>
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


const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const PopupBody = styled('div')(
  ({ theme }) => `
  width: max-content;
  padding: 12px 16px;
  margin: 8px;
  border-radius: 8px;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  box-shadow: ${
    theme.palette.mode === 'dark'
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`
  };
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  z-index: 1;
`,
);