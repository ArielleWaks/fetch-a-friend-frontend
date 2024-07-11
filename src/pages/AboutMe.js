import * as React from 'react';
import Container from '@mui/material/Container';
import {Typography} from "@mui/material";
import Divider from '@mui/material/Divider';


export default function AboutMe () {
  return (
    <Container maxWidth="sm">
      <Typography variant="body1" >
        Hi! I'm Arielle
        <Divider variant="middle" />
        Test
      </Typography>
    </Container>
  )
}
