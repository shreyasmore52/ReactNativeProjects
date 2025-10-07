import { View, Text , StyleSheet, Pressable,Image} from "react-native"


export default function TopProfileComponet({ navigation }){
    
    return<>
    <View style={styles.flex}>

        <View>
            <Pressable onPress={ () => navigation.navigate("Profile")}>
                 <Text>Profile</Text>
                <Image />
            </Pressable>
            
        </View>
        <View>
  
        </View>
        <View>
            <Pressable onPress={ () => navigation.navigate("Setting")}>
               
            </Pressable>
        </View>
    </View>
    </>
}


const styles = StyleSheet.create({

    flex:{
        flex:"1",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        margin:2,
        padding:10
    },
    iconImg:{
        width:50,
        height:50,
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20
        
    }

})