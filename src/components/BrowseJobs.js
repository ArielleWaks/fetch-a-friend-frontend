import React, { useEffect, useState } from "react";
import { Container, Typography, Autocomplete, TextField} from '@mui/material';
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

  const descriptions = [];

  for (let i = 0; i < jobArray.length; i++){
    descriptions.push({label: jobArray[i].description});
  }
  
  return (
    <Container>
      <Typography varient="h1">
        Search jobs by...
      </Typography>

      <Autocomplete disablePortal id="combo-box-demo" options={descriptions} sx={{ width: 300 }} 
      renderInput={(params) => <TextField {...params} label="Animal" />}/>


      {jobArray.map((field, id) => {
        return (
          <JobCard jobObject={field} id={id} deleteCallback={deleteCallback} deleteEnabled={false} editEnabled={false} key={id} />
        )
      })}
    </Container>
  );
};