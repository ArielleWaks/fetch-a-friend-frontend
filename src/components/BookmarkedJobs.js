import React, { useEffect, useState } from "react";
import { Container, Typography } from '@mui/material';
import JobCard from "./JobCard";
import EventBus from "../common/EventBus";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3000/api";

export default function BookmarkedJobs() {
  const [jobArray, setJobArray] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUser(user);
    async function fetchData() {
      try {
        if (user) {
          const response = await fetch(API_URL + '/jobs/myBookmarkedJobs', {
            headers: {
              'Authorization': 'Bearer ' + user.accessToken,
              'Content-Type': 'application/json'
            }
          });
          const json = await response.json();
          setJobArray(json);
          console.log(json);
        }
      } catch (error) {
        const errorMessage = error.message || error.toString();
        console.error(errorMessage);
        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    }
    fetchData();
  }, []);
  return (
    <Container>
      <Typography variant="h3" align="center">
        <br />
        Your Bookmarked Jobs
        <br />
        <br />
      </Typography>

      {jobArray.length > 0 ? (
        jobArray.map((field, id) => (
          <JobCard
            jobObject={field}
            id={id}
            deleteEnabled={false}
            editEnabled={false}
            bookmarkEnabled={true}
            acceptEnabled={!user ? false : true}
            key={id}
          />
        ))
      ) : (
        <Typography variant="body1" align="center">You have no bookmarked jobs. Go <Link to={"/jobs"}>fetch</Link> some!</Typography>
      )}
    </Container>
  );
}
