import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

import EventBus from "./common/EventBus";
import BrowseJobs from "./pages/BrowseJobs";
import CreateJob from "./pages/CreateJob";
import MyJobs from "./pages/MyJobs";
import MyJobsSitting from "./pages/MyJobsSitting";
import UpdateJob from "./pages/UpdateJob";
import TestApp from "./components/TestMapComponent";
import LoggedInDropdown from "./components/LoggedInDropdown";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ChatRoom from "./pages/ChatRoomComponent";
import FetchAJobDropdown from "./components/FetchAJobDropdown";
import BookmarkedJobs from "./pages/BookmarkedJobs";

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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container-fluid">
      <Link to={"/"} className="navbar-brand">
        Fetch a Friend
      </Link>
      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav">
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
          {currentUser ? (
            <>
              <li className="nav-item">
                <FetchAJobDropdown />
              </li>
              <li className="nav-item">
              <LoggedInDropdown logOut={logOut} />
              </li>
            </>
          ) : (
            <>
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
            </>
          )}
        </ul>
        </div></div></nav>
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<BrowseJobs/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/jobs/add" element={<CreateJob/>} />
            <Route path="/jobs/edit/:id" element={<UpdateJob/>} />
            <Route path="/jobs/myjobs" element={<MyJobs/>} />
            <Route path="/jobs/mysitting" element={<MyJobsSitting/>} />
            <Route path="/jobs" element={<BrowseJobs/>} />
            <Route path="/map-search" element={<TestApp/>} />
            <Route path="/chatroom" element={<ChatRoom />} />
            <Route path="/jobs/mybookmarks" element={<BookmarkedJobs />} />
          </Routes>
        </div>

      </div>
    </LocalizationProvider>
  );
};

export default App;