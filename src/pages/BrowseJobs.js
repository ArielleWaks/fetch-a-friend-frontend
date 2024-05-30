import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  ListItemText,
  Autocomplete,
  TextField,
} from '@mui/material';
import JobCard from "../components/JobCard";
import EventBus from "../common/EventBus";

const API_URL = "/api";

export default function BrowseJobs () {
  const [jobArray, setJobArray] = useState([]);
  const [selectedSortingMethod, setSelectedSortingMethod] = useState([]);
  const [selectedAnimals, setSelectedAnimals] = useState([]);
  const [user, setUser] = useState()
  const [selectedZipCode, setSelectedZipCode] = useState(0);
  const [hasSearchedChanged, setHasSearchChanged] = useState(false);
  const petTypes = {
    Dog: 'DOG',
    Cat: 'CAT',
    Fish: 'FISH',
    Bird: 'BIRD',
    Hamster: 'HAMSTER',
    Guineapig: 'GUINEAPIG',
    Rabbit: 'RABBIT',
    Lizard: 'LIZARD',
    Turtle: 'TURTLE',
    Ferret: 'FERRET',
    Mouse: 'MOUSE',
    Chinchilla: 'CHINCHILLA'
  }

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

  // list of zip codes from jobArray jobs for zip code filter
  const zipCodeOptions = [...new Set(jobArray.map(job => job.zipCode.toString()))];
  
  const handleAnimalChange = (event) => {
    const { value } = event.target;
    setSelectedAnimals(value);
  };

  const handleSortingChange = (event) => {
    const { value } = event.target;
    setSelectedSortingMethod(value);
    setHasSearchChanged(true);
  };

  const handleZipCodeChange = (event, value) => { setSelectedZipCode(Number(value)); };
  
  const animalFilter = (job) => {
    return selectedAnimals.length === 0 || selectedAnimals.includes(job.petType)
  };
  
  const zipFilter = (job) => {
    return selectedZipCode === 0 || selectedZipCode === job.zipCode
  };
  
  useEffect(() => {
    if(hasSearchedChanged){
    let sortedData = [...jobArray];

    if (selectedSortingMethod === "payHighToLow") {sortedData.sort((a, b) => b.payRate - a.payRate);}
    else if (selectedSortingMethod === "payLowToHigh") {sortedData.sort((a, b) => a.payRate - b.payRate);}
    else if (selectedSortingMethod === "hoursHighToLow") {sortedData.sort((a, b) => b.totalHours - a.totalHours);}
    else if (selectedSortingMethod === "hoursLowToHigh") {sortedData.sort((a, b) => a.totalHours - b.totalHours);}

    setJobArray(sortedData);
    setHasSearchChanged(false);
  }
  }, [selectedSortingMethod, hasSearchedChanged, jobArray]);

  return (
    <Container>
      <Typography variant="h3" align="center">
        Browse Available Jobs
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
          {Object.keys(petTypes).sort().map((key) => (
            <MenuItem key={key} value={petTypes[key]}>
              <Checkbox checked={selectedAnimals.includes(petTypes[key])} />
              <ListItemText primary={key} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{m: 1, width: 200 }}>
        <Autocomplete id="zip-code-options" options={zipCodeOptions} sx={{ width: 300 }}
        onChange={handleZipCodeChange} renderInput={(params) => <TextField {...params} label="Zip Code" />}
        />
      </FormControl>
      <br/>
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
      {jobArray.filter(animalFilter)
        .filter(zipFilter)
        .map((field, id) => {
          return (
            <JobCard jobObject={field}
                     id={id}
                     deleteEnabled={false}
                     editEnabled={false}
                     bookmarkEnabled={true}
                     acceptEnabled={user !== null}
                     key={id}
            />
          )
        })
      }
    </Container>
  );
};