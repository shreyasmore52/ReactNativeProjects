import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import axiosInstance from "../services/axiosInstance";

export default function RegisterScreen({ navigation }){

    return (
        <View style={styles.flex}>
            <RegisterFormComponent navigation={navigation} />
        </View>
    )
}

function RegisterFormComponent({ navigation }){
    const [Email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");

    const validateRegistration = async () => {
        if (!Email || !password || !firstname || !lastname ) {  
          return Alert.alert("Error", "All fields are required");
        } 
        try{
          const res = await axiosInstance.post("/signUp",{
            Email,
            password,
            firstname,
            lastname,
          });
          
          if(res.data.msg === "User Exists"){
            return Alert.alert("Error", res.data.msg);
            
          }

          Alert.alert("Success", "User register complete !");
          navigation.navigate("Login");
          
        }catch(e){
           console.error("Registration error:", e.message);
            Alert.alert("Error", "Something went wrong. Try again.");
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register Plz</Text>
           
 <TextInput
        placeholder="First Name"
        style={styles.input}
        placeholderTextColor="#555"
        onChangeText={setFirstname}
      />

      <TextInput
        placeholder="Last Name"
        style={styles.input}
        placeholderTextColor="#555"
        onChangeText={setLastname}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        placeholderTextColor="#555"
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#555"
        onChangeText={setPassword}
      />        
        <Pressable style={styles.button}
          onPress={validateRegistration} >
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </Pressable>
            
        </View>
    )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4f7",
  },
  container: {
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
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    paddingBottom: 30,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#4a90e2",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#4a90e2",
    fontSize: 16,
    marginTop: 25,
    textDecorationLine: "underline",
  },
});