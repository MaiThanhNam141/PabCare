import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from '../screens/HomeScreen'
import ProfileScreen from'../screens/ProfileScreen'
import QuizzScreen from "../screens/QuizzScreen";
import MiniApp from "../screens/MiniApp";
import LoginScreen from "../screens/LoginScreen";

import ChatAI from "../component/ChatAI";
import Focus from "../component/Focus";
import Todo from "../component/Todo";
import Diary from "../component/Diary";

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
            <Stack.Screen name="chatai" component={ChatAI} />
        </Stack.Navigator>
    )
}


const ProfileStackNavigator = () =>{
    return(
        <Stack.Navigator
            initialRouteName='loginscreen'
            screenOptions={{
                headerStyle:{
                    backgroundColor:"#91c4f8"
                },
                headerShown:false
            }}>
            <Stack.Screen name="profilescreen" component={ProfileScreen}/>
            <Stack.Screen name="loginscreen" component={LoginScreen}/>
        </Stack.Navigator>
    )
}

const QuizzStackNavigator = () => {
    return(
        <Stack.Navigator 
            initialRouteName="quizzscreen"
            screenOptions={{
                headerStyle:{
                    backgroundColor:"#91c4f8"
                },
                headerShown:false
            }}>
            <Stack.Screen name="quizzscreen" component={QuizzScreen} />
        </Stack.Navigator>
    )
}

const MiniAppStackNavigator = () => {
    return(
        <Stack.Navigator 
            initialRouteName="miniapp"
            screenOptions={{
                headerStyle:{
                    backgroundColor:"#91c4f8"
                },
                headerShown:false
            }}>
            <Stack.Screen name="miniapp" component={MiniApp} />
            <Stack.Screen name="focus" component={Focus} />
            <Stack.Screen name="todo" component={Todo} />
            <Stack.Screen name="diary" component={Diary} />
        </Stack.Navigator>
    )
}

export  {MainStackNavigator, ProfileStackNavigator, QuizzStackNavigator, MiniAppStackNavigator}