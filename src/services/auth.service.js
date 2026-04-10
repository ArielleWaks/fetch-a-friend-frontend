import { postJson } from "./http";

const API_URL = "/api/auth/";

const register = (username, email, password) => {
  return postJson(API_URL + "signup", {
    username,
    email,
    password,
  }).then((data) => ({ data }));
};

const login = (username, password) => {
  return postJson(API_URL + "signin", {
    username,
    password,
  }).then((data) => {
    if (data && data.accessToken) {
      localStorage.setItem("user", JSON.stringify(data));
    }

    return data;
  });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
