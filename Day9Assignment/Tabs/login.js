import  {useState, useEffect} from "react";
import { View , Text, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosUrl from "../apiServices/axiosUrlApi";
import loginUserCheck from "../apiServices/authServiceApi";
import  SafeAreaWrapper from "../components/safeAreaView";

export default function LogInScreen({ navigation }){
    return <>
    <SafeAreaWrapper>
    <View style={styles.flex}>
      <TokenCheck navigation={navigation} />
      <LoginFormComponent navigation={navigation} />
    </View>
    </SafeAreaWrapper>  
    </>
}

function TokenCheck({navigation}){
 const [loder, setLoder] = useState(true);

  useEffect(() =>{
        async function checkToken(){
            try{
                const token = await AsyncStorage.getItem("userToken");
                if(token){
                    const res = await axiosUrl.post("/verify",{},
                        {
                            headers: {
                            Authorization: `Bearer ${token}`
                        }}
                    );

                    if(res.data.success){
                        navigation.replace("Home");
                        return ;
                    }
                }
            }catch(e){
                console.log("Token check failed:", e.message);
            } finally {
                setLoder(false); // stop loader
            }
        }
        checkToken();
    }, []);

        if(loder){
        return <>
        <View style={styles.flex}>
            <ActivityIndicator size="large" color="#304a67ff"/>
        </View>
        </>
    }

    return null;

}

function LoginFormComponent({ navigation }) {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");

  async function validateLogin() {
    if (!email || !password) {
      return Alert.alert("Error", "All fields are required");
    }

    const res = await loginUserCheck(email, password);
    if (res.success) {
      await AsyncStorage.setItem("userToken", res.token);

      Alert.alert("Success", "Login complete");
      navigation.replace("Profile");
    } else {
      console.log(res.error);
      Alert.alert("Login Failed", res.error || "Invalid credentials");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        placeholder="email"
        style={styles.input}
        placeholderTextColor="#555"
        onChangeText={setemail}
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

      <Pressable onPress={() => navigation.navigate("SignUp")}>
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
    backgroundColor: "#c0c6caff",
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
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    paddingBottom: 30,
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
    textDecorationLine: "underline",
  },
});