
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LogInScreen from './Tabs/login'
import ProfileScreen from './Tabs/profile'

const Stack = createNativeStackNavigator();

export default function App(){

  return <>
          <NavigationContainer>
             <Stack.Navigator initialRouteName="Profile">
                <Stack.Screen name="LogIn" 
                  component={LogInScreen}
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
