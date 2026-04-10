import api from "@/api/client";
import { paths } from "@/api/paths";

const register = (username, email, password) => {
  return api
    .post(paths.auth.signup, {
      username,
      email,
      password,
    })
    .then((response) => ({ data: response.data }));
};

const login = (username, password) => {
  return api.post(paths.auth.signin, { username, password }).then((response) => {
    const data = response.data;
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
