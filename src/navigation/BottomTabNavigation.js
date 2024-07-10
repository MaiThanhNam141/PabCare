import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, {useContext, useEffect } from "react";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native"
import { MainStackNavigator, ProfileStackNavigator, QuizzStackNavigator, MiniAppStackNavigator } from "./StackNavigator";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { UserContext } from "../feature/context/UserContext";
import { MusicContext } from "../feature/context/MusicContext";
import Sound from 'react-native-sound';

const Tab = createBottomTabNavigator()

const BottomTabNavigation = () => {
  const { userLoggedIn, loading } = React.useContext(UserContext);
  const { currentSongContext, isPlayingSong, roll } = useContext(MusicContext)

  useEffect(() => {
    if(isPlayingSong && !roll){
      Sound.setCategory("Playback");
      const audio = new Sound(currentSongContext.file, (error) => {
        if (error) {
          console.log("Error playing audio", error);
          return;
        }
        const playAudio = () => {
          audio.play((success) => {
            if (success) {
              playAudio();
            } else {
              console.log("Failed to play the audio");
            }
          });
        };
        playAudio()
      });

      return () => {
        audio.release();
      };
    }
  }, [isPlayingSong, roll]);

  const hiddenRoutes = ['loginscreen', 'focus', 'todo', 'diary', 'mood', 'bmi', 'music', 'goldensleep', 'bmiresult', 'chatai', 'quiz', 'bdi', 'eq', 'member'];
  
  const getTabBarStyle = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "";
    if (hiddenRoutes.includes(routeName)) {
      return { display: "none" };
    }
    return {};
  };

  if (loading){}

  return(
    <Tab.Navigator
      initialRouteName={userLoggedIn?'HomeScreen':'ProfileScreen'}
      screenOptions={({route}) => ({
        headerShown:false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarHideOnKeyboard: true,
        tabBarStyle:{
          borderTopLeftRadius:10,
          borderTopRightRadius:10,
          overflow:"hidden",
          backgroundColor:"#fff",
          height:49,
          ...getTabBarStyle(route)
        },
      })}
    >
      <Tab.Screen name='HomeScreen' component={MainStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="home" size={size} color={color} />
          )
        }}  
      />
      <Tab.Screen name='QuizzScreen' component={QuizzStackNavigator}
        options={{
          tabBarIcon: ({ size, color}) => (
            <MaterialIcons name="quiz" size={size} color={color} />
          )
        }} 
      />
      <Tab.Screen name='MiniApp' component={MiniAppStackNavigator}
        options={{ 
            tabBarIcon: ({ size, color }) => (
              <MaterialIcons name="list-alt" size={size} color={color} />
            )
        }}
      />
      <Tab.Screen name='ProfileScreen' component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="account-circle" size={size} color={color} />
          )
        }}
      />
          
    </Tab.Navigator>
  )
}

export default BottomTabNavigation
