import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Home";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AppBottomTab from './AppBottomTab'
const Tab = createMaterialTopTabNavigator();
export default function App1() {

    return (
        <View style={{ flex: 1 }}>
            <NavigationContainer independent={true}>
                <Tab.Navigator initialRouteName="Home" >
                    <Tab.Screen name="Home" component={Home} />
                    <Tab.Screen name="AppBottomTab" component={AppBottomTab} />

                </Tab.Navigator>
            </NavigationContainer>
        </View>
    )
}