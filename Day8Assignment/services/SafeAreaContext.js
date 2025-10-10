import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme, StyleSheet } from "react-native";

export default function SafeArea({children}){

    const color = useColorScheme();

    return (
        <SafeAreaView
            style={[
         styles.container,
        { backgroundColor: color === "dark" ? "#000" : "#c0c6caff"},
    ]}
        >
            {children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    }
})