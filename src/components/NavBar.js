import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import FetchAJobDropdown from "./FetchAJobDropdown";
import LoggedInDropdown from "./LoggedInDropdown";
import {Link} from "react-router-dom";

export default function NavBar({ currentUser, logOut }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/*<IconButton*/}
          {/*  size="large"*/}
          {/*  edge="start"*/}
          {/*  color="inherit"*/}
          {/*  aria-label="menu"*/}
          {/*  sx={{ mr: 2 }}*/}
          {/*>*/}
          {/*  <MenuIcon />*/}
          {/*</IconButton>*/}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Fetch a Friend
          </Typography>
          <Button color="inherit" >
            <Link to={"/jobs"} className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }} >
              Browse Job Listings
            </Link>
          </Button>
          {/*<FetchAJobDropdown color="inherit" />*/}
          {currentUser ? (
            <LoggedInDropdown logOut={logOut} />
          ) : (
            <>
              <Button color="inherit" >
                <Link to={"/login"} className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }} >
                  Login
                </Link>
              </Button>
              <Button color="inherit" >
                <Link to={"/register"} className="nav-link" style={{ textDecoration: 'none', color: 'inherit' }} >
                  Register
                </Link>
              < /Button >
            </>
          )
          }
          {/*<Button color="inherit">Login</Button>*/}
        </Toolbar>
      </AppBar>
    </Box>
  );
}