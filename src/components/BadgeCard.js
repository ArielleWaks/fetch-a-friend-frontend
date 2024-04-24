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
import animalAvatarSelector from "./functions/animalAvatarSelector";

const API_URL = "http://localhost:3000/api";

export default function BadgeCard () {
  const [badgeArray, setBadgeArray] = useState([]);
  const navigate = useNavigate();
  
  const avatarPicker = (badgeType, jobNumber, badge) => {
    if(badgeType === "JOB") {
      if(jobNumber === 1) {
        return "/badge_ribbon_with_paw.png";
      } else {
        return "/badge_ribbon_with_paw.png";
      }
    }
    if(badgeType === "SPECIALTY") {
      return animalAvatarSelector(badge);
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
    <Card variant="outlined" class="card">
      <CardContent>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          useFlexGap flexWrap="wrap"
        >
          {badgeArray.map((badge) => (
            <Tooltip title={badge.name} >
              <Badge
                color="primary"
                overlap="circular"
                badgeContent={badge.badgeType === "JOB" ? badge.numberOfJobs : 0}
              >
                <Avatar
                  src={avatarPicker(badge.badgeType, badge.numberOfJobs, badge)}
                  sx={{ width: 70, height: 70, p: 0.5 }}
                  // style={{ border: '0.1px solid lightgray' }}
                  key={badge.id}
                />
              </Badge>
            </Tooltip>
          ))}
        </Stack>
      </CardContent>
      <CardHeader
        subheader="My Achievements"
        sx={{textAlign: 'center'}}
      />
    </Card>
  )

}