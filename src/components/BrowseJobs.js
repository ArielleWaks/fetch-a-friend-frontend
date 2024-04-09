import React, { useEffect, useState } from "react";
import { Container, Typography, Checkbox, Button, Select, MenuItem, FormControl, InputLabel,
OutlinedInput, ListItemText} from '@mui/material';
import JobCard from "./JobCard";

import EventBus from "../common/EventBus";


const API_URL = "http://localhost:3000/api";

export default function BrowseJobs () {
  const [jobData, setJobData] = useState([]);
  const [jobArray, setJobArray] = useState([]);
  const [selectedSortingMethod, setSelectedSortingMethod] = useState([]);
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

  /* 
  const deleteCallback = (id) => {
    setJobArray(jobArray.filter((job) => (job.id !== id)));
  } */

 
  
  const animalSelections = [];

  for (let i = 0; i < jobData.length; i++){
    if ((!animalSelections.includes(jobData[i].chosenAnimalType))){
    animalSelections.push(jobData[i].chosenAnimalType);}};

  const handleAnimalChange = (event) => {
    const { value } = event.target;
    setSelectedAnimals(value);
  };

  const handleSortingChange = (event) => {
    const { value } = event.target;
    setSelectedSortingMethod(value);
  };




  const processSearch = function(){
    let tempJobArray = [];
    console.log(jobData);

    for (let i = 0; i < selectedAnimals.length; i++){
      const selectedLabel = selectedAnimals[i];
      const filteredJobs = jobData.filter(job => job.chosenAnimalType === selectedLabel);
      tempJobArray.push(...filteredJobs);}

      if (selectedSortingMethod === 10){
        tempJobArray.sort((a, b) => a.payRate - b.payRate);
      } else if (selectedSortingMethod === 20){
        tempJobArray.sort((a, b) => b.payRate - a.payRate);
      }
      

    setJobArray(tempJobArray);
  };
  
  return (
    <Container>
      <Typography varient="h1">
        Search jobs by...
      </Typography>

      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="animal-type-filter">Animal</InputLabel>
        <Select
          labelId="animal-select-checkbox"
          id="animal-select"
          multiple
          value={selectedAnimals}
          onChange={handleAnimalChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {animalSelections.map((animal) => (
            <MenuItem key={animal} value={animal}>
              <Checkbox checked={selectedAnimals.includes(animal)} />
              <ListItemText primary={animal} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, width: 200 }}>
      <Select defaultValue={10} id="sorting-method" onChange={handleSortingChange}>
        <MenuItem value={10}>Pay Rate Hi-Lo</MenuItem>
        <MenuItem value={20}>Pay Rate Lo-Hi</MenuItem>
        <MenuItem value={30}>Hours Hi-Lo</MenuItem>
        <MenuItem value={40}>Hours Lo-Hi</MenuItem>
      </Select>
      </FormControl>
  
    
      <Button variant="contained" onClick={processSearch}>Search</Button>

      {jobArray.map((field, id) => {
        return (
          <JobCard jobObject={field} id={id} deleteEnabled={false} editEnabled={false} key={id} />
        )
      })}
    </Container>
  );
};