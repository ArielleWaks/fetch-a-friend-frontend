import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Box } from '@mui/material';
import JobCard from "./JobCard";

import EventBus from "../common/EventBus";

const API_URL = "http://localhost:3000/api";

export default function BrowseJobs () {
  const [jobArray, setJobArray] = useState([]);
  const [user, setUser] = useState()
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUser(user);
    async function fetchData() {
      try {
        const response = await fetch(API_URL + '/jobs/open', {
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
  
  const deleteCallback = (id) => {
    setJobArray(jobArray.filter((job) => (job.id !== id)));
  }
  
  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Browse Pet Sitting Jobs
      </Typography>
      {user === null &&
        <Box sx={{p: 1, border: '1px solid grey', borderRadius: 1 }} >
          <Typography variant="subtitle1" >
            <Link to="../login">Login </Link>
            or
            <Link to="../register"> Create an Account </Link>
            to Create and Accept Pet Sitting Openings!
          </Typography>
        </Box>
      }
      {jobArray.map((field, id) => {
        return (
          <JobCard jobObject={field}
                   id={id}
                   deleteCallback={deleteCallback}
                   deleteEnabled={false}
                   editEnabled={false}
                   acceptEnabled={user !== null}
                   key={id}
          />
        )
      })}
    </Container>
  );
};