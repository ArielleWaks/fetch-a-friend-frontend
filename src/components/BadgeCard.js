import { React, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Tooltip,
  Badge, Stack
} from "@mui/material";

const API_URL = "http://localhost:3000/api";

export default function BadgeCard () {
  const [badgeArray, setBadgeArray] = useState([]);
  const navigate = useNavigate();
  
  const avatarPicker = (badgeType, jobNumber, pet) => {
    if(badgeType === "JOB") {
      if(jobNumber === 1) {
        return "/badge_ribbon_with_paw.png";
      } else {
        return "/badge_ribbon_with_paw.png";
      }
    }
    if(badgeType === "SPECIALTY") {
      if(pet === "DOG") {
        return "/badge_dog.png";
      } else if (pet === "CAT") {
        return "/badge_cat.png";
      }
    }
    return "/badge_house_paw.png";
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user === null) {
      navigate('/login');
    }

    async function fetchData(){
      try {
        const response = await fetch(API_URL + '/badges/mybadges', {
          headers: {
            'Authorization': 'Bearer ' + user.accessToken,
            'Content-Type': 'application/json'
          }
        });
        const json = await response.json()
        setBadgeArray(json);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [navigate]);

  return (
    <Card variant="outlined" >
      <CardHeader
        title="My Achievements"
      />
      <CardContent>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          {badgeArray.map((badge) => (
            <Tooltip title={badge.name} >
              <Badge
                color="primary"
                overlap="circular"
                badgeContent={badge.badgeType === "JOB" ? badge.numberOfJobs : 0}
              >
                <Avatar
                  src={avatarPicker(badge.badgeType, badge.numberOfJobs, badge.petType)}
                  sx={{ width: 56, height: 56 }}
                  style={{ border: '0.1px solid lightgray' }}
                  key={badge.id}
                />
              </Badge>
            </Tooltip>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )

}