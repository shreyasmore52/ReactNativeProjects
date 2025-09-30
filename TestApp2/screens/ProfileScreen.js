import { View,Text , StyleSheet ,Button} from "react-native";

export default function ProfileScreen ({navigation}){

    return <>
    <View style={styles.container}>
        <Text style={styles.text}>Welcome to Profile Screen</Text>
        <br />
         <Button title="LogOut" 
                    onPress={() => navigation.navigate("Login")} />
    </View>
    </>
}

const styles = StyleSheet.create({
    container: {
        flex :1,
        alignItems:"center",
        justifyContent:"center"
    },
    text:{
        fontSize:24,
        marginBottom:206
    }
})