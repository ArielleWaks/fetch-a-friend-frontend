import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function LoggedInDropdown({ logOut }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const username = user.username;
  const navigate = useNavigate();

  const handleLogOut = () => {
    handleClose();
    logOut();
    navigate('/login');
  };

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color="inherit"
      >
        {username}
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem onClick={handleClose}>My Profile</MenuItem>
        </Link>
        <Link to="/jobs/add" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem onClick={handleClose}>List a Job</MenuItem>
        </Link>
        <Link to="/jobs/myjobs" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem onClick={handleClose}>Manage My Jobs</MenuItem>
        </Link>
        <Link to="/jobs/mysitting" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem onClick={handleClose}>View My Pet Sitting Gigs</MenuItem>
        </Link>
        <Link to="/jobs/mybookmarks" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem onClick={handleClose}>My Bookmarked Jobs</MenuItem>
        </Link>
        <MenuItem onClick={handleLogOut} style={{ color: 'red' }}>LogOut</MenuItem>
      </Menu>
    </div>
  );
}
