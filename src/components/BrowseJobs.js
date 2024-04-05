import React, { useEffect, useState } from "react";
import { Container, Typography, Checkbox, Button, Select, MenuItem, FormControl, InputLabel,
OutlinedInput, ListItemText} from '@mui/material';
import JobCard from "./JobCard";

import EventBus from "../common/EventBus";

const API_URL = "http://localhost:3000/api";

export default function BrowseJobs () {
  const [jobData, setJobData] = useState([]);
  const [jobArray, setJobArray] = useState([]);
  const [selectedAnimals, setSelectedAnimals] = useState([]);
  
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
        setJobData(json);
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

  for (let i = 0; i < jobData.length; i++){
    if ((!descriptions.includes(jobData[i].description))){
    descriptions.push(jobData[i].description);}}

  const handleAnimalChange = (event) => {
    const { value } = event.target;
    setSelectedAnimals(value);
  };

  const processSearch = function(event){
    let tempJobArray = [];
    console.log(selectedAnimals);
    for (let i = 0; i < selectedAnimals.length; i++){
      const selectedLabel = selectedAnimals[i];
      const filteredJobs = jobData.filter(job => job.description === selectedLabel);
      tempJobArray.push(...filteredJobs);
    }
    setJobArray(tempJobArray);
  }
  
  return (
    <Container>
      <Typography varient="h1">
        Search jobs by...
      </Typography>

      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Animal</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedAnimals}
          onChange={handleAnimalChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {descriptions.map((animal) => (
            <MenuItem key={animal} value={animal}>
              <Checkbox checked={selectedAnimals.includes(animal)} />
              <ListItemText primary={animal} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" onClick={processSearch}>Search</Button>

      {jobArray.map((field, id) => {
        return (
          <JobCard jobObject={field} id={id} deleteCallback={deleteCallback} deleteEnabled={false} editEnabled={false} key={id} />
        )
      })}
    </Container>
  );
};