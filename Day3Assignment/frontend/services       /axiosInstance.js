import axios from "axios";

const BASE_URL = "http://localhost:3004/api/v1/user"; // for ios emulator only works 


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
 
});
export default axiosInstance;