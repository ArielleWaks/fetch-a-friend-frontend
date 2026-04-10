import api from "@/api/client";
import { paths } from "@/api/paths";

const getPublicContent = () => {
  return api.get(paths.user.all);
};

const UserService = {
  getPublicContent,
};

export default UserService;
