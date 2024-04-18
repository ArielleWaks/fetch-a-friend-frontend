import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";

import AuthService from "./services/auth.service";

import BoardAdmin from "./components/BoardAdmin";
import BoardModerator from "./components/BoardModerator";
import BoardUser from "./components/BoardUser";
import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";

import EventBus from "./common/EventBus";
import BrowseJobs from "./components/BrowseJobs";
import CreateJob from "./components/CreateJob";
import MyJobs from "./components/MyJobs";
import MyJobsSitting from "./components/MyJobsSitting";
import UpdateJob from "./components/UpdateJob";
import TestApp from "./components/TestMapComponent";
import MapSearch from "./components/MapSearchComponent";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ChatRoom from "./components/ChatRoomComponent";

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showJobBoard, setJobBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [showImageBoard, setShowImageBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setJobBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
      setShowImageBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowImageBoard(false);
    setJobBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Fetch a Friend
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>
          
                           
            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/mod"} className="nav-link">
                  Moderator Board
                </Link>
              </li>
            )}

            {showJobBoard && (
              <li className="nav-item">
                <Link to={"/jobs"} className="nav-link">
                   Jobs
                </Link>
              </li>
            )}

            


            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Admin Board
                </Link>
              </li>
            )}

          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/home" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/user" element={<BoardUser/>} />
            <Route path="/mod" element={<BoardModerator/>} />
            <Route path="/admin" element={<BoardAdmin/>} />
            <Route path="/jobs/add" element={<CreateJob/>} />
            <Route path="/jobs/edit/:id" element={<UpdateJob/>} />
            <Route path="/jobs/myjobs" element={<MyJobs/>} />
            <Route path="/jobs/mysitting" element={<MyJobsSitting/>} />
            <Route path="/jobs" element={<BrowseJobs/>} />
            <Route path="/map-search" element={<TestApp/>} />
            <Route path="/chatroom" element={<ChatRoom />} />
          </Routes>
        </div>

      </div>
    </LocalizationProvider>
  );
};

export default App;