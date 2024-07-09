import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Stack from '@mui/material/Stack';
import {Tooltip} from "@mui/material";


function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://fetch.witheo.com">
        Fetch A Friend
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function ContactButtons() {
  return (
    <Stack direction="row" spacing={4} alignItems="center" justifyContent="center"   >
      <Tooltip title="GitHub" >
        <Link href="https://github.com/ArielleWaks">
          <GitHubIcon  />
        </Link>
      </Tooltip>
      <Tooltip title="LinkedIn" >
        <Link href="https://www.linkedin.com/in/ariellewaks/" >
          <LinkedInIcon/>
        </Link>
      </Tooltip>
    </Stack>
  )
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function StickyFooter() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 'auto',
          width: '100%',
          position: 'relative',
          bottom: '0',
        }}
      >
        <CssBaseline />
        {/*<Container component="main" sx={{ mt: 8, mb: 2 }} maxWidth="sm">*/}
        {/*  <Typography variant="h2" component="h1" gutterBottom>*/}
        {/*    Sticky footer*/}
        {/*  </Typography>*/}
        {/*  <Typography variant="h5" component="h2" gutterBottom>*/}
        {/*    {'Pin a footer to the bottom of the viewport.'}*/}
        {/*    {'The footer will move as the main element of the page grows.'}*/}
        {/*  </Typography>*/}
        {/*  <Typography variant="body1">Sticky footer placeholder.</Typography>*/}
        {/*</Container>*/}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800],
          }}
        >
          <Container maxWidth="sm" >
            <ContactButtons />
            <Copyright />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
