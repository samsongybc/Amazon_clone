import axios from "axios";
export const productUrl = "https://fakestoreapi.com";
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5001/clone-66248/us-central1/api",
  headers: {
    "Content-Type": "application/json",
  },
  responseType: "json",
  timeout: 10000,
});
export { axiosInstance };
