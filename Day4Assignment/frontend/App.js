import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import  RegisterScreen from './screen/signup'
import LogInScreen from './screen/login'
import HomeScreen from './screen/home'
import ProfileScreen from './screen/profile'

const Stack = createNativeStackNavigator();

export default function App(){

  return <>
          <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen name="SignUp" 
                component={RegisterScreen}
                options={{
                  headerShown: false
                }}
                />
                <Stack.Screen name="LogIn" 
                  component={LogInScreen}
                   options={{
                  headerShown: false
                }}
                />
                <Stack.Screen name="Home"
                component={HomeScreen}
                   options={{
                  headerShown: false
                }}
                />
                <Stack.Screen name="Profile"
                component={ProfileScreen}
                   options={{
                  headerShown: false
                }}
                />
              </Stack.Navigator>
          </NavigationContainer>
  </>
}
