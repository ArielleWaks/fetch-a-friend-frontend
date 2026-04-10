import { getJson, request } from "./http";

const BASE_URL = "/file";

class FileService {
  getAllImages() {
    return getJson(BASE_URL);
  }

  uploadImage(fileFormData) {
    return request(BASE_URL + "/upload", {
      method: "POST",
      body: fileFormData,
    });
  }
}

export default new FileService();
