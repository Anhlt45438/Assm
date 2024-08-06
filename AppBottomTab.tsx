import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AppVietghichu from './AppVietghichu'
import AppVietnhatky from './AppVietnhatky'
import { Image, Text, View } from "react-native";
const tab = createBottomTabNavigator();

export default function App() {
    return (
        <View style={{ flex: 1 }}>
            <tab.Navigator>
                <tab.Screen name="AppVietghichu" component={AppVietghichu} options={{
                    headerShown: false, tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: "center", justifyContent: "center", top: 10 }}>
                            <Image source={require('./img/write.png')}
                                resizeMode="contain"
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? 'red' : 'gray'
                                }} />
                            <Text style={{ color: focused ? 'red' : 'gray' }}>Nhật ký</Text>
                        </View>
                    )
                }} />
                <tab.Screen name="Điều biết ơn" component={AppVietnhatky} options={{
                    headerShown: false, tabBarLabel: '',
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: "center", justifyContent: "center", top: 10 }}>
                            <Image source={require('./img/gratitude.png')}
                                resizeMode="contain"
                                style={{
                                    width: 25,
                                    height: 25,
                                    tintColor: focused ? 'red' : 'gray'
                                }}
                            />
                            <Text style={{ color: focused ? 'red' : 'gray' }}>Điều biết ơn</Text>
                        </View>
                    )
                }} />
            </tab.Navigator>
        </View>
    )
}