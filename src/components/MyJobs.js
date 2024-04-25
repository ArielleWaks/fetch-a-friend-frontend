import React, { useEffect, useState } from "react";
import {Box, Container, Tooltip, Typography} from '@mui/material';
import JobCard from "./JobCard";

import {Link, useNavigate} from "react-router-dom";

const API_URL = "http://localhost:3000/api";

export default function MyJobs () {
  const [jobArray, setJobArray] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user === null) {
      navigate('/login');
    }
    async function fetchData() {
      const user = JSON.parse(localStorage.getItem('user'));
      try {
        const response = await fetch(API_URL + '/jobs/myjobs', {
          headers: {
            'Authorization': 'Bearer ' + user.accessToken,
            'Content-Type': 'application/json'
          }
        });
        const json = await response.json()
        setJobArray(json);
      } catch (error) {
        console.log(error);
      }
    }
    
    fetchData();
  }, [navigate]);
  
  const deleteCallback = (id) => {
    setJobArray(jobArray.filter((job) => (job.id !== id)));
  }
  
  return (
    <Container>
      <Typography variant="h3" gutterBottom={true}>
        My Jobs
      </Typography>
      {jobArray && jobArray.length === 0 &&
        <Box sx={{p: 1, border: '1px solid grey', borderRadius: 1 }} >
          <Typography variant="subtitle1" >
            If you need a pet sitter, fill out&nbsp;
            <Tooltip title="Create Job"><Link to="../jobs/add">this form</Link></Tooltip>
            &nbsp;to let local pet sitters know!
          </Typography>
        </Box>
      }
      {jobArray && jobArray.map((field, id) => {
        return (
          <JobCard jobObject={field} id={id} deleteCallback={deleteCallback} deleteEnabled={true} editEnabled={true} acceptEnabled={false} key={id} />
        )
      })}
    </Container>
  );
};