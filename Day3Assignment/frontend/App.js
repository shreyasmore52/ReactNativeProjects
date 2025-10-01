import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/loginscreen';
import { StackScreen } from 'react-native-screens';
import RegisterScreen from './screens/RegisterScreen';
const Stack  = createNativeStackNavigator();
export default function App(){

    return <>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Register'>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <StackScreen name="Login" component={LoginScreen} />
                    <StackScreen name="Register"component={RegisterScreen} />
                 </Stack.Navigator>
        </NavigationContainer>
    </>
}

