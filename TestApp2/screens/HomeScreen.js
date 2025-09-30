import { useNavigation } from "@react-navigation/native";
import {View , Text , StyleSheet, Button } from "react-native"

export default function HomeScreen({navigation}){ // using prop

    // const navigation = useNavigation(); // Or using custom hooks 

    return <>
        <View style={styles.container}> 
            <Text style={styles.text}> Home Screen</Text>
            <Button title="Go to Profile" 
            onPress={() => navigation.navigate("Profile")} />
        </View>
    </>
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems:"center",
        justifyContent:"center"
    },
    text:{
        fontSize:24,
        marginBottom:16
    },
});