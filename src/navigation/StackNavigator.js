import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from '../screens/HomeScreen'
import ProfileScreen from'../screens/ProfileScreen'
import QuizzScreen from "../screens/QuizzScreen";
import MiniApp from "../screens/MiniApp";
import LoginScreen from "../screens/LoginScreen";

import ChatAI from "../component/OtherScreen/ChatAI";

import Focus from "../component/MiniApp/Focus";
import Todo from "../component/MiniApp/Todo";
import Diary from "../component/MiniApp/Diary";
import Mood from "../component/MiniApp/Mood";
import Healthy from '../component/MiniApp/Healthy';
import Music from "../component/MiniApp/Music";
import GoldenSleep from "../component/MiniApp/GoldenSleep";

import Quizz from "../component/QuizzScreen/Quiz";
import EQQuiz from "../component/QuizzScreen/EQQuiz";
import BDIQuiz from "../component/QuizzScreen/BDIQuiz";

import React, {useEffect, useContext} from "react";
import auth from '@react-native-firebase/auth'

import { UserContext } from "../feature/context/UserContext";

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
    const {userLoggedIn, setUserLoggedIn} = useContext(UserContext);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(user => {
            setUserLoggedIn(!!user);
        });

        return unsubscribe;
    }, [setUserLoggedIn]);
    return(
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#91c4f8"
                },
                headerShown: false
            }}>
            {userLoggedIn ? (
                <Stack.Screen name="profilescreen" component={ProfileScreen} />
            ) : (
                <Stack.Screen name="loginscreen" component={LoginScreen} />
            )}
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
            <Stack.Screen name="quiz" component={Quizz} />
            <Stack.Screen name="bdi" component={BDIQuiz} />
            <Stack.Screen name="eq" component={EQQuiz} />
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
            <Stack.Screen name="mood" component={Mood} />
            <Stack.Screen name="healthy" component={Healthy} />
            <Stack.Screen name="music" component={Music} />
            <Stack.Screen name="goldensleep" component={GoldenSleep} />
        </Stack.Navigator>
    )
}

export  {MainStackNavigator, ProfileStackNavigator, QuizzStackNavigator, MiniAppStackNavigator}


