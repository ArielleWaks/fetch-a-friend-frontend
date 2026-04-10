import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import CircularProgress from "@mui/material/CircularProgress";

import AuthService from "../services/auth.service";
import { getAuthFeedback } from "../utils/authFeedback";

function loginUsernameError(username) {
  if (!username.trim()) return "This field is required!";
  return "";
}

function loginPasswordError(password) {
  if (!password) return "This field is required!";
  return "";
}

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remoteError, setRemoteError] = useState(null);
  const [touched, setTouched] = useState({ username: false, password: false });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const uErr = loginUsernameError(username);
  const pErr = loginPasswordError(password);
  const showU = touched.username || submitAttempted;
  const showP = touched.password || submitAttempted;
  const formValid = !uErr && !pErr;

  const handleLogin = (e) => {
    e.preventDefault();
    setRemoteError(null);
    setSubmitAttempted(true);
    if (!formValid) return;

    setLoading(true);

    AuthService.login(username, password).then(
      () => {
        navigate("/profile");
        window.location.reload();
      },
      (error) => {
        setLoading(false);
        setRemoteError(getAuthFeedback(error, { action: "sign you in" }));
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
          Sign in
        </Typography>
        <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1, width: "100%" }}>
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
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() =>
              setTouched((t) => ({
                ...t,
                password: true,
              }))
            }
            error={showP && Boolean(pErr)}
            helperText={showP ? pErr : ""}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
          <Typography align="center">
            <Link component={RouterLink} to="/register" variant="body2">
              Don&apos;t have an account? Sign Up
            </Link>
          </Typography>
          {remoteError ? (
            remoteError.soft ? (
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mt: 2, px: 0.5 }}
              >
                {remoteError.text}
              </Typography>
            ) : (
              <Alert severity="error" sx={{ mt: 2 }}>
                {remoteError.text}
              </Alert>
            )
          ) : null}
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
