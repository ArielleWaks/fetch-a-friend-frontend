import { getJson } from "./http";
import authHeader from "./auth-header";

const API_URL = "/api/user/";

const getPublicContent = () => {
  return getJson(API_URL + "all", authHeader());
};

const getImageContent = () => {
  return getJson("/file/upload", authHeader());
};

const UserService = {
  getPublicContent,
  getImageContent,
};

export default UserService;
