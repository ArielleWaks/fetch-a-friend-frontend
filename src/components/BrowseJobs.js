import React, { useEffect, useState } from "react";
import { Container, Typography, Autocomplete, TextField, Checkbox, Button} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import JobCard from "./JobCard";

import EventBus from "../common/EventBus";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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

  for (let i = 0; i < jobArray.length; i++){
    descriptions.push({label: jobArray[i].description});}

    
  const handleAnimalChange = function(event, value){
    setSelectedAnimals(value);
    console.log(value);
  }

  const processSearch = function(event){
    let tempJobArray = [];
    console.log(selectedAnimals);
    for (let i = 0; i < selectedAnimals.length; i++){
      const selectedLabel = selectedAnimals[i].label;
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

      
    <Autocomplete multiple id="animals" options={descriptions} disableCloseOnSelect
      onChange={handleAnimalChange} value={selectedAnimals}
      getOptionLabel={(option) => option.label} renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.label}
        </li>
      )}
      style={{ width: 500 }}
      renderInput={(params) => (
        <TextField {...params} label="Search By Animal(s)"/>
      )}/>
      <Button variant="contained" onClick={processSearch}>Search</Button>



      {jobArray.map((field, id) => {
        return (
          <JobCard jobObject={field} id={id} deleteCallback={deleteCallback} deleteEnabled={false} editEnabled={false} key={id} />
        )
      })}
    </Container>
  );
};