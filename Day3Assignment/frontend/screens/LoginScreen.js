import { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from "react-native";

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.flex}>
      <LoginFormComponent navigation={navigation} />
    </View>
  );
}

function LoginFormComponent({ navigation }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const validateLogin = () => {
    if(!username || !password){

      return Alert.alert("Error", "All filelds are required");

    }else{
      navigation.navigate("Home");
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      
      <TextInput 
      placeholder="Username" 
      style={styles.input} 
      placeholderTextColor="#555"
      onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#555"
        onChangeText={setPassword}
      />
     
      <Pressable style={styles.button} onPress={validateLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>Don’t have an account? Register</Text>
      </Pressable>

    </View>
  );
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
    height: 400,
    padding: 25,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 8, // for Android shadow
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    paddingBottom:30,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 25,
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
    textDecorationLine: "underline", // makes it look like a link
  },
});
