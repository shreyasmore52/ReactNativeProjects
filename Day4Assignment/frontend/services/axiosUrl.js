import axios from "axios"

const axiosUrl = axios.create({
    baseURL: "http://localhost:3004/api/user",
    headers:{
        "Content-Type": "application/json",
    },

})

export default axiosUrl;