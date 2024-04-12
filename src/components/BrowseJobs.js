import React, { useEffect, useState } from "react";
import { Container, Typography, Checkbox, Button, Select, MenuItem, FormControl, InputLabel,
OutlinedInput, ListItemText, Autocomplete, TextField} from '@mui/material';
import { Link } from "react-router-dom";
import { Container, Typography, Box } from '@mui/material';
import JobCard from "./JobCard";
import EventBus from "../common/EventBus";


const API_URL = "http://localhost:3000/api";

export default function BrowseJobs () {
  const [jobData, setJobData] = useState([]);
  const [jobArray, setJobArray] = useState([]);
  const [selectedSortingMethod, setSelectedSortingMethod] = useState([]);
  const [selectedAnimals, setSelectedAnimals] = useState([]);
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

  //Creates a list of possible zip codes based on the jobData
  const zipCodeOptions = [];
  
  for (let i = 0; i < jobData.length; i++){
    if((!zipCodeOptions.includes(String(jobData[i].zipCode)))){
      zipCodeOptions.push(String(jobData[i].zipCode));
    }};

  zipCodeOptions.sort((a,b) => a - b);


  //Creates a list of possible animal types based on the jobData
  const animalOptions = [];

  for (let i = 0; i < jobData.length; i++){
    if ((!animalOptions.includes(jobData[i].chosenAnimalType))){
    animalOptions.push(jobData[i].chosenAnimalType);}};

  //User input handler functions
  const handleAnimalChange = (event) => {
    const { value } = event.target;
    setSelectedAnimals(value);
  };

  const handleSortingChange = (event) => {
    const { value } = event.target;
    console.log(value);

    setSelectedSortingMethod(value);};

  useEffect(() => {
    let sortedData = [...jobData];

    if (selectedSortingMethod === "payHighToLow") {sortedData.sort((a, b) => b.payRate - a.payRate);}
    else if (selectedSortingMethod === "payLowToHigh") {sortedData.sort((a, b) => a.payRate - b.payRate);}
    else if (selectedSortingMethod === "hoursHighToLow") {sortedData.sort((a, b) => b.totalHours - a.totalHours);}
    else if (selectedSortingMethod === "hoursLowToHigh") {sortedData.sort((a, b) => a.totalHours - b.totalHours);}

    setJobArray(sortedData);
  }, [selectedSortingMethod, jobData]);


  //Function for when submit button is pressed
  const processSearch = function(){
    let tempJobArray = [];
    console.log(jobData);

    for (let i = 0; i < selectedAnimals.length; i++){
      const selectedLabel = selectedAnimals[i];
      const filteredJobs = jobData.filter(job => job.chosenAnimalType === selectedLabel);
      tempJobArray.push(...filteredJobs);}

    setJobArray(tempJobArray);
  };

  //html
  return (
    <Container>
      <Typography variant="h3" align="center">
        Fetch a Job
      </Typography>
      {(Object.is(user, null)) &&
        <Box sx={{p: 1, border: '1px solid grey', borderRadius: 1 }} >
          <Typography variant="subtitle1" >
            <Link to="../login">Login </Link>
            or
            <Link to="../register"> Create an Account </Link>
            to Create and Accept Pet Sitting Openings!
          </Typography>
        </Box>
      }

      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="animal-type-filter">Animal</InputLabel>
        <Select
          labelId="animal-select-checkbox"
          id="animal-select"
          multiple
          value={selectedAnimals}
          onChange={handleAnimalChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}>
          {animalOptions.map((animal) => (
            <MenuItem key={animal} value={animal}>
              <Checkbox checked={selectedAnimals.includes(animal)} />
              <ListItemText primary={animal} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{m: 1, width: 200 }}>
        <Autocomplete disablePortal id="combo-box-demo" options={zipCodeOptions} sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Zip Code" />}
        />
      </FormControl>
      <br></br>
      <Button variant="contained" align="center" onClick={processSearch}>Search!</Button>
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
          <JobCard jobObject={field}
                   id={id}
                   deleteCallback={deleteCallback}
                   deleteEnabled={false}
                   editEnabled={false}
                   bookmarkEnabled={true}
                   acceptEnabled={Object.is(user, null) ? false : true}
                   key={id}
          />
        )
      })}
    </Container>
  );
};