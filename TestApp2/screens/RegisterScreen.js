import {View , Text ,StyleSheet } from "react-native"
import { Button, TextInput } from "react-native-web";

export default function RegisterScreen({navigation}){

    return <>
        <View style={styles.container}> 
        <Text style={styles.text}> Register Screen</Text>
            <View >
            <Text style={styles.lable}>Submit Name</Text>
            <TextInput style={styles.input} placeholder="enter Email" />
            <br />
            <Button title="Click Login" 
                        onPress={() => navigation.navigate("Home")} />
            </View>
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
        marginBottom:46
    },
    input: {
        height:40,
        borderWidth: 1,
        borderColor:'gray',
        paddingHorizontal: 10,
        marginTop:5,
        borderRadius:5
    },
    lable:{
       textAlign:"left"
    }
});