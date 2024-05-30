import axios from "axios"

const BASE_URL = "/file"

class FileService {
    getAllImages() {
        return axios.get(BASE_URL);
    }

    uploadImage(fileFormData){
        return axios.post(BASE_URL+'/upload', fileFormData);
    }
}

export default new FileService();