import axiosInstance  from "./axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function loginUser(Email, password){
    try{
        const response = await axiosInstance.post("/logIn", {
            Email,
            password
        });

        const token = response.data.token;

        if (!token) {
          console.log("No token received from server:", response.data);
          return { success: false, message: response.data?.msg || "Login failed" };
        }

        await AsyncStorage.setItem("userToken", token);
        
        return {
            success: true,
            token: token
        }
    }catch(e){
         return { 
            success: false,
            message: e.message || "Something went wrong" };
    }
}