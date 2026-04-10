import { Route, Routes } from "react-router-dom";

import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import BrowseJobs from "@/pages/BrowseJobs";
import CreateJob from "@/pages/CreateJob";
import MyJobs from "@/pages/MyJobs";
import MyJobsSitting from "@/pages/MyJobsSitting";
import UpdateJob from "@/pages/UpdateJob";
import BookmarkedJobs from "@/pages/BookmarkedJobs";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<BrowseJobs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/jobs/add" element={<CreateJob />} />
      <Route path="/jobs/edit/:id" element={<UpdateJob />} />
      <Route path="/jobs/myjobs" element={<MyJobs />} />
      <Route path="/jobs/mysitting" element={<MyJobsSitting />} />
      <Route path="/jobs" element={<BrowseJobs />} />
      <Route path="/jobs/mybookmarks" element={<BookmarkedJobs />} />
    </Routes>
  );
}
