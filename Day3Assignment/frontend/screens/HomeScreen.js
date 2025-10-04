import { View, Text, StyleSheet,Pressable } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../services/axiosInstance";


export default function HomeScreen({ navigation }){
    return <>
        <View style={styles.flex}>
            <Text style={styles.text}>Home Page</Text>
            <ProfileComponent navigation={navigation}/>
        </View>
     
    </>

}

 function ProfileComponent({navigation}){
    const [user, setUser] = useState(null);
    useEffect (() => {
        const fetchUser = async () => {
        try{
            const token = await AsyncStorage.getItem("userToken");
            const res = await axiosInstance.get("/home",{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
         setUser(res.data.user);
        }catch(e){
            return res.json({
                error: "Invalid token: " + e.message 
            })
        }
    };

    fetchUser();  
}, [])

    async function logoutScreen(){
        await AsyncStorage.removeItem("userToken");
        navigation.navigate("Login");

    }

    return (
        <>
        
        <View style={styles.container}>
            <Text>{user ? `Hello ${user.firstname} sir 👋` : "Loading user..."}</Text>
        </View>
        <View style={{paddingTop:100}}>
            <Pressable style={styles.button} onPress={logoutScreen}>
                <Text style={styles.buttonText}>LogOut</Text>
            </Pressable>
        </View>
        
        </>
    )
}

const styles = StyleSheet.create({
    container:{
    width: "85%",
    padding: 25,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8
    },
    flex:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#9cb5c8ff"
    },
    text:{
        fontSize:30,
        fontWeight:500,
        paddingBottom:50
    },  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#e24a93ff",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
})