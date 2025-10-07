import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert} from "react-native";
import axiosUrl from "../services/axiosUrl";
import  SafeAreaWrapper from "../components/safeAreaView";

export default function RegisterScreen({ navigation }){
    return <>
        <SafeAreaWrapper>
         <View style={styles.flex}>
            <SignupComponent navigation={navigation}/>
        </View>
        </SafeAreaWrapper>
       
    </>
}

function SignupComponent({ navigation }){
    const [ email, setemail] = useState("");
    const [ password, setpassword] = useState("");
    const [ firstName, setfirstName] = useState("");
    const [ lastName, setlastName] = useState("");

    async function Inputvalidation (){
        if( !email || !password || !firstName || !lastName){
            return Alert,alert("Error","fill all fields");
        }

        try{
            const res = await axiosUrl.post("/signUp",{
                email, 
                password, 
                firstName,
                lastName,
            });

            if(res.data.msg === "User Exits "){
                return Alert.alert("Error", res.data.msg);
            }
            Alert.alert("Success", "Registration complete ");
            navigation.navigate("LogIn");
        }catch(e){
           console.error("Registration error:", e.message);
            Alert.alert("Error", "Something went wrong. Try again.");
        }
    }

    return <>
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up </Text>
           
            <TextInput
                    placeholder="First Name"
                    style={styles.input}
                    placeholderTextColor="#555"
                    onChangeText={setfirstName}
                />

                <TextInput
                    placeholder="Last Name"
                    style={styles.input}
                    placeholderTextColor="#555"
                    onChangeText={setlastName}
                />

                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    placeholderTextColor="#555"
                    onChangeText={setemail}
                />

                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    secureTextEntry
                    placeholderTextColor="#555"
                    onChangeText={setpassword}
                />        
                <Pressable style={styles.button}
                    onPress={Inputvalidation} >
                    <Text style={styles.buttonText}>Register</Text>
                </Pressable>

                <Pressable onPress={() => navigation.navigate("LogIn")}>
                    <Text style={styles.linkText}>Already have an account? Login</Text>
                </Pressable>
            
        </View>
    
    </>
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#c0c6caff",
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