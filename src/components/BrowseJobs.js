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
    descriptions.push({label: jobArray[i].description});}

  const handleClick = function(){
    alert("Clicked!");
  }
  
  return (
    <Container>
      <Typography varient="h1">
        Search jobs by...
      </Typography>

      
    <Autocomplete multiple id="checkboxes-tags-demo" options={descriptions} disableCloseOnSelect
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
        <TextField {...params} label="Search By Animal(s)" />
      )}/>
      <Button variant="contained" onClick={handleClick}>Search</Button>


      {jobArray.map((field, id) => {
        return (
          <JobCard jobObject={field} id={id} deleteCallback={deleteCallback} deleteEnabled={false} editEnabled={false} key={id} />
        )
      })}
    </Container>
  );
};