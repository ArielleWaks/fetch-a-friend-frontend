import api from "@/api/client";
import { paths } from "@/api/paths";
import authHeader from "./auth-header";

const getPublicContent = () => {
  return api
    .get(paths.user.all, { headers: authHeader() })
    .then((response) => response.data);
};

const getImageContent = () => {
  return api
    .get("/file/upload", { headers: authHeader() })
    .then((response) => response.data);
};

const UserService = {
  getPublicContent,
  getImageContent,
};

export default UserService;
