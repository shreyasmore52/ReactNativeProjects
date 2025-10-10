import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import TaskScreen from "./Tabs/task";

const Stack = createNativeStackNavigator();

export default function App(){

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Task" >
        <Stack.Screen name="Task"
          component={TaskScreen}
          options={{
            headerShown: false
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}