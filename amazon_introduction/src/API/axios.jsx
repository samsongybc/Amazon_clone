import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5001/clone-761f8/us-central1/api",
});

export default axiosInstance;
