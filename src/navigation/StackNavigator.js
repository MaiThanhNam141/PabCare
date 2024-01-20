import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from '../screens/HomeScreen'
import ProfileScreen from'../screens/ProfileScreen'
import ChatAI from "../screens/ChatAI";
import MiniApp from "../screens/MiniApp";
import React from "react";

const Stack = createStackNavigator()

const MainStackNavigator = () =>{
    return(
        <Stack.Navigator
            initialRouteName='homescreen'
            screenOptions={{
                headerStyle:{
                    backgroundColor:"#91c4f8"
                },
                headerShown:false
            }}>
            <Stack.Screen name="homescreen" component={HomeScreen}/>
        </Stack.Navigator>
    )
}


const ProfileStackNavigator = () =>{
    return(
        <Stack.Navigator
            initialRouteName='profile-screen'
            screenOptions={{
                headerStyle:{
                    backgroundColor:"#91c4f8"
                },
                headerShown:false
            }}>
            <Stack.Screen name="profilescreen" component={ProfileScreen}/>
        </Stack.Navigator>
    )
}

const ChatAIStackNavigator = () => {
    return(
        <Stack.Navigator 
            initialRouteName="chatAI"
            screenOptions={{
                headerStyle:{
                    backgroundColor:"#91c4f8"
                },
                headerShown:false
            }}>
            <Stack.Screen name="chatAI" component={ChatAI} />
        </Stack.Navigator>
    )
}

const MiniAppStackNavigator = () => {
    return(
        <Stack.Navigator 
            initialRouteName="MiniApp"
            screenOptions={{
                headerStyle:{
                    backgroundColor:"#91c4f8"
                },
                headerShown:false
            }}>
            <Stack.Screen name="MiniApp" component={MiniApp} />
        </Stack.Navigator>
    )
}

export  {MainStackNavigator, ProfileStackNavigator, ChatAI, MiniApp}