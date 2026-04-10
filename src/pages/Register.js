import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { isEmail } from "validator";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";

import AuthService from "../services/auth.service";
import { getAuthFeedback } from "../utils/authFeedback";

function usernameError(username) {
  if (!username.trim()) return "This field is required!";
  if (username.length < 3 || username.length > 20) {
    return "The username must be between 3 and 20 characters.";
  }
  return "";
}

function emailError(email) {
  if (!email.trim()) return "This field is required!";
  if (!isEmail(email)) return "This is not a valid email.";
  return "";
}

function passwordError(password) {
  if (!password) return "This field is required!";
  if (password.length < 6 || password.length > 40) {
    return "The password must be between 6 and 40 characters.";
  }
  return "";
}

function passwordConfirmError(password, passwordConfirm) {
  if (!passwordConfirm) return "This field is required!";
  if (passwordConfirm !== password) return "The passwords do not match.";
  return "";
}

const initialTouched = {
  username: false,
  email: false,
  password: false,
  passwordConfirm: false,
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [serverErrorSoft, setServerErrorSoft] = useState(false);
  const [touched, setTouched] = useState(initialTouched);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const uErr = usernameError(username);
  const eErr = emailError(email);
  const pErr = passwordError(password);
  const pcErr = passwordConfirmError(password, passwordConfirm);

  const showU = touched.username || submitAttempted;
  const showE = touched.email || submitAttempted;
  const showP = touched.password || submitAttempted;
  const showPc = touched.passwordConfirm || submitAttempted;

  const formValid = !uErr && !eErr && !pErr && !pcErr;

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    setServerErrorSoft(false);
    setSuccessful(false);
    setSubmitAttempted(true);
    if (!formValid) return;

    AuthService.register(username, email, password).then(
      (response) => {
        setMessage(response.data.message);
        setServerErrorSoft(false);
        setSuccessful(true);
      },
      (error) => {
        const fb = getAuthFeedback(error, { action: "complete sign-up" });
        setMessage(fb.text);
        setServerErrorSoft(fb.soft);
        setSuccessful(false);
      }
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile"
          sx={{ width: 96, height: 96, mb: 1 }}
        />
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleRegister}
          sx={{ mt: 1, width: "100%" }}
        >
          {!successful && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() =>
                  setTouched((t) => ({
                    ...t,
                    username: true,
                  }))
                }
                error={showU && Boolean(uErr)}
                helperText={showU ? uErr : ""}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() =>
                  setTouched((t) => ({
                    ...t,
                    email: true,
                  }))
                }
                error={showE && Boolean(eErr)}
                helperText={showE ? eErr : ""}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() =>
                  setTouched((t) => ({
                    ...t,
                    password: true,
                    ...(passwordConfirm.trim() !== "" ? { passwordConfirm: true } : {}),
                  }))
                }
                error={showP && Boolean(pErr)}
                helperText={showP ? pErr : ""}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="passwordConfirm"
                label="Confirm Password"
                type="password"
                id="passwordConfirm"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                onBlur={() =>
                  setTouched((t) => ({
                    ...t,
                    passwordConfirm: true,
                  }))
                }
                error={showPc && Boolean(pcErr)}
                helperText={showPc ? pcErr : ""}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign Up
              </Button>
            </>
          )}
          <Typography align="center">
            <Link component={RouterLink} to="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Typography>
          {message ? (
            successful ? (
              <Alert severity="success" sx={{ mt: 2 }}>
                {message}
              </Alert>
            ) : serverErrorSoft ? (
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mt: 2, px: 0.5 }}
              >
                {message}
              </Typography>
            ) : (
              <Alert severity="error" sx={{ mt: 2 }}>
                {message}
              </Alert>
            )
          ) : null}
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
