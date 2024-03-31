import React, { useEffect, useState } from "react";
import { Container, Typography } from '@mui/material';
import JobCard from "./JobCard";

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
  
  const deleteCallback = (id) => {
    setJobArray(jobArray.filter((job) => (job.id !== id)));
  }
  
  return (
    <Container>
      <Typography varient="h1">
        Browse Open Jobs
      </Typography>
      {jobArray.map((field, id) => {
        return (
          <JobCard jobObject={field} id={id} deleteCallback={deleteCallback} deleteEnabled={false} key={id} />
        )
      })}
    </Container>
  );
};