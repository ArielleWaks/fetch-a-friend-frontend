import React, { useEffect, useState } from "react";
import { Container, Typography } from '@mui/material';
import JobCard from "./JobCard";

import {useNavigate} from "react-router-dom";

const API_URL = "http://localhost:3000/api";

export default function MyJobsSitting () {
  const [jobArray, setJobArray] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user === null) {
      navigate('/login');
    }
    async function fetchData() {
      const user = JSON.parse(localStorage.getItem('user'));
      try {
        const response = await fetch(API_URL + '/jobs/mysitting', {
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
      <Typography varient="h1">
        My Pet Sitting
      </Typography>
      {jobArray.map((field, id) => {
        return (
          <JobCard jobObject={field} id={id} deleteCallback={deleteCallback} deleteEnabled={false} editEnabled={false} acceptEnabled={false} key={id} />
        )
      })}
    </Container>
  );
};