import React, { useEffect, useState } from "react";
import "./App.css";

import AuthService from "@/services/auth.service";
import NavBar from "@/components/NavBar";
import StickyFooter from "@/components/StickyFooter";
import Container from "@mui/material/Container";
import { AppRoutes } from "@/app/routes";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  return (
    <div>
      <NavBar currentUser={currentUser} logOut={logOut} />
      <div>
        <Container sx={{ pt: 5 }}>
          <AppRoutes />
        </Container>
      </div>
      <StickyFooter />
    </div>
  );
};

export default App;
