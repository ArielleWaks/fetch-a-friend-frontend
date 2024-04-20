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
        <MenuItem onClick={handleClose}><Link to={"/profile"} className="nav-link">My Profile</Link></MenuItem>
        <MenuItem onClick={handleClose}><Link to={"/jobs/mysitting"} className='nav-link'>Manage My Jobs</Link></MenuItem>
        <MenuItem onClick={handleClose}>Bookmarked Jobs</MenuItem>
        <MenuItem onClick={handleLogOut}>LogOut</MenuItem>
      </Menu>
    </div>
  );
}
