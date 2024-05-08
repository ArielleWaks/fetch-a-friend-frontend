import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000/api/user/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getImageContent = () => {
  return axios.get("http://localhost:8080/file/upload");
};

const UserService = {
  getPublicContent,
  getImageContent
};

export default UserService;
