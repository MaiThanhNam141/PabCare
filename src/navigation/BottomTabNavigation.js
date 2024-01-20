import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MiniApp from "../screens/MiniApp";
import ChatAI from "../screens/ChatAI";
const Tab = createBottomTabNavigator()

const BottomTabNavigation = () => {
    return(
        <Tab.Navigator
            initialRouteName='HomeScreen'
            screenOptions={{
            headerShown:false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: "black",
            tabBarInactiveTintColor: "gray",
            tabBarStyle:{
                borderTopLeftRadius:20,
                borderTopRightRadius:20,
                overflow:"hidden",
                backgroundColor:"#fff",
                height:60
            },
        }}>
            <Tab.Screen name='HomeScreen' component={HomeScreen}
                options={{
                  tabBarIcon: ({ size, color}) => (
                    <MaterialIcons name="home" size={size} color={color} />
                  ),
                }} />
            <Tab.Screen name='ChatAI' component={ChatAI}
                options={{
                    tabBarIcon: ({ size, color }) => (
                      <MaterialIcons name="chat-bubble-outline" size={size} color={color} />
                    ),
                  }}/>
            <Tab.Screen name='MiniApp' component={MiniApp}
                options={{
                    tabBarIcon: ({ size, color }) => (
                      <MaterialIcons name="list-alt" size={size} color={color} />
                    ),
                  }}/>
            <Tab.Screen name='ProfileScreen' component={ProfileScreen}
                options={{
                    tabBarIcon: ({ size, color }) => (
                      <MaterialIcons name="account-circle" size={size} color={color} />
                    ),
                  }}/>
            
        </Tab.Navigator>
    )
}

export default BottomTabNavigation
