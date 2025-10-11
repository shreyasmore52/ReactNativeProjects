import axios from "axios"

const axiosUrl = axios.create({
    baseURL: "http://localhost:3000/user",
    headers:{
        "Content-Type": "application/json",
    },

})

export default axiosUrl;