import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppTopTab from "./AppTopTab"
import AppSignin from "./AppSignin";
import AppSignup from "./AppSignup"
const stack = createNativeStackNavigator();
export default function Appmaster() {
    return (
        <NavigationContainer>
            <stack.Navigator initialRouteName="AppSignin">
                <stack.Screen name="AppSignin" component={AppSignin} options={{ headerShown: false }} />
                <stack.Screen name="AppSignup" component={AppSignup} options={{ headerShown: false }} />
                <stack.Screen options={{ headerShown: false }} name="AppTopTab" component={AppTopTab} />
            </stack.Navigator>
        </NavigationContainer>
    )
}