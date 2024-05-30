import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/api/user/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getImageContent = () => {
  return axios.get("/file/upload");
};

const UserService = {
  getPublicContent,
  getImageContent
};

export default UserService;
