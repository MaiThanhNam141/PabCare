import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useContext, useEffect, useState, useRef } from "react";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { MainStackNavigator, ProfileStackNavigator, QuizzStackNavigator, MiniAppStackNavigator } from "./StackNavigator";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { UserContext } from "../feature/context/UserContext";
import { MusicContext } from "../feature/context/MusicContext";
import Sound from 'react-native-sound';

const Tab = createMaterialTopTabNavigator();

const BottomTabNavigation = () => {
  const { userLoggedIn, loading } = useContext(UserContext);
  const { currentSongContext, isPlayingSong, roll } = useContext(MusicContext);
  const [audio, setAudio] = useState(null);
  const [position, setPosition] = useState(0);
  const soundRef = useRef(null);

  useEffect(() => {
    if (isPlayingSong && !roll) {
      if (soundRef.current) {
        soundRef.current.release();
      }
      Sound.setCategory("Playback");
      const newAudio = new Sound(currentSongContext.file, (error) => {
        if (error) {
          console.log("Error playing audio", error);
          return;
        }
        newAudio.setVolume(0.3);
        if (position > 0) {
          newAudio.setCurrentTime(position);
        }
        const playAudio = () => {
          newAudio.play((success) => {
            if (success) {
              playAudio();
            } else {
              console.log("Failed to play the audio");
            }
          });
        };
        playAudio();
      });
      setAudio(newAudio);
      soundRef.current = newAudio;
    } else if (audio) {
      audio.getCurrentTime((seconds) => {
        setPosition(seconds);
      });
      audio.pause();
    }

    return () => {
      if (audio) {
        audio.release();
        setAudio(null);
      }
    };
  }, [isPlayingSong, roll]);
  
  const hiddenRoutes = [
    'loginscreen', 'focus', 'todo', 'diary', 'mood', 'bmi', 'music', 
    'goldensleep', 'bmiresult', 'chatai', 'quiz', 'bdi', 'eq', 'member', 'disc'
  ];

  if (loading) {
    return null;
  }; 

  const getTabBarStyle = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "";
    if (hiddenRoutes.includes(routeName.toLowerCase())) {
      return { display: "none" };
    }
    return {};
  };

  const isSwipeEnabled = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "";
    return !hiddenRoutes.includes(routeName.toLowerCase());
  };

  return (
    <Tab.Navigator
      initialRouteName={userLoggedIn ? 'HomeScreen' : 'ProfileScreen'}
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarHideOnKeyboard: true,
        swipeEnabled: isSwipeEnabled(route),
        tabBarStyle: {
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          overflow: "hidden",
          backgroundColor: "#fff",
          height: 49,
          ...getTabBarStyle(route)
        },
        tabBarIconStyle: {
          width: 25,
          height: 25,
        }
      })}
    >
      <Tab.Screen name='HomeScreen' component={MainStackNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={25} color={color} />
          )
        }}
      />
      <Tab.Screen name='QuizzScreen' component={QuizzStackNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="quiz" size={25} color={color} />
          )
        }}
      />
      <Tab.Screen name='MiniApp' component={MiniAppStackNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="list-alt" size={25} color={color} />
          )
        }}
      />
      <Tab.Screen name='ProfileScreen' component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-circle" size={25} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
