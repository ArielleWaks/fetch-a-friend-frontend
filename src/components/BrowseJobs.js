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

  
  const animalOptions = [];

  for (let i = 0; i < jobData.length; i++){
    if ((!animalOptions.includes(jobData[i].chosenAnimalType))){
    animalOptions.push(jobData[i].chosenAnimalType);}};

  const handleAnimalChange = (event) => {
    const { value } = event.target;
    setSelectedAnimals(value);
  };

  const handleSortingChange = (event) => {
    const { value } = event.target;
    console.log(value);
    
    setSelectedSortingMethod(value);
  };
  
  useEffect(() => {
    let sortedData = [...jobData]; // Create a copy of jobData
  
    if (selectedSortingMethod === "payHighToLow") {
      sortedData.sort((a, b) => b.payRate - a.payRate);
    } else if (selectedSortingMethod === "payLowToHigh") {
      sortedData.sort((a, b) => a.payRate - b.payRate);
    } else if (selectedSortingMethod === "hoursHighToLow") {
      sortedData.sort((a, b) => b.totalHours - a.totalHours);
    } else if (selectedSortingMethod === "hoursLowToHigh") {
      sortedData.sort((a, b) => a.totalHours - b.totalHours);
    }
  
    setJobArray(sortedData);
  }, [selectedSortingMethod, jobData]);



  const processSearch = function(){
    let tempJobArray = [];
    console.log(jobData);

    for (let i = 0; i < selectedAnimals.length; i++){
      const selectedLabel = selectedAnimals[i];
      const filteredJobs = jobData.filter(job => job.chosenAnimalType === selectedLabel);
      tempJobArray.push(...filteredJobs);}

    setJobArray(tempJobArray);
  };
  
  return (
    <Container>
      <Typography variant="h3" align="center">
        Fetch a Job
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
          {animalOptions.map((animal) => (
            <MenuItem key={animal} value={animal}>
              <Checkbox checked={selectedAnimals.includes(animal)} />
              <ListItemText primary={animal} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" onClick={processSearch}>Search!</Button>
      <br></br>
      <FormControl sx={{ m: 1, width: 200 }}>
      <InputLabel id="sort-jobs-by">Sort jobs by</InputLabel>
      <Select defaultValue="Default" id="sorting-method" onChange={handleSortingChange}>
        <MenuItem value={"Default"}>Sort By...</MenuItem>
        <MenuItem value={"payHighToLow"}>Pay Rate Hi-Lo</MenuItem>
        <MenuItem value={"payLowToHigh"}>Pay Rate Lo-Hi</MenuItem>
        <MenuItem value={"hoursHighToLow"}>Hours Hi-Lo</MenuItem>
        <MenuItem value={"hoursLowToHigh"}>Hours Lo-Hi</MenuItem>
      </Select>
      </FormControl>

      {jobArray.map((field, id) => {
        return (
          <JobCard jobObject={field} id={id} deleteEnabled={false} editEnabled={false} bookmarkEnabled={true} key={id} />
        )
      })}
    </Container>
  );
};