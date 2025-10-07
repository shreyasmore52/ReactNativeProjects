import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme, StyleSheet} from "react-native"

export default function SafeAreaWrapper({ children }){
    const colorScheme = useColorScheme();
    return <>
        <SafeAreaView  style={[
        styles.safeContainer,
        { backgroundColor: colorScheme === "dark" ? "#000" : "#c0c6caff" },
      ]}>
            { children }
        </SafeAreaView>
    </>
}



const styles = StyleSheet.create({

    safeContainer:{
        flex:1,
        backgroundColor:"#c0c6caff",

    }

})