import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

function App(){
  
  return <>
  <NavigationContainer>
    <Stack.Navigator initialRouteName='Registration'>
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="Registration" component={RegisterScreen}/>
      <Stack.Screen name="Login" component={LoginScreen}/>
       <Stack.Screen name="Profile" component={ProfileScreen}/>
    </Stack.Navigator>
  </NavigationContainer>
  </>

}

export default App