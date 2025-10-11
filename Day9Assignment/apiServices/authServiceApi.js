import axiosUrl  from "./axiosUrlApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function loginUserCheck(email, password){
    try{
        const response = await axiosUrl.post("/logIn", {
            email,
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