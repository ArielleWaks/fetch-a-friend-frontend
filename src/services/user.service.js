import axios from "axios";

const API_URL = "/api/user/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const UserService = {
  getPublicContent,
};

export default UserService;
