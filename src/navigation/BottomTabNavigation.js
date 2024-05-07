import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native"
import { MainStackNavigator, ProfileStackNavigator, QuizzStackNavigator, MiniAppStackNavigator } from "./StackNavigator";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const Tab = createBottomTabNavigator()

const BottomTabNavigation = () => {
  const hiddenRoutes = ['focus', 'todo', 'diary', 'mood', 'bmi', 'music', 'goldensleep', 'bmiresult', 'chatai', 'quiz', 'bdi', 'eq'];

  return(
    <Tab.Navigator
      initialRouteName='HomeScreen'
      screenOptions={{
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
        },

      }}>
      <Tab.Screen name='HomeScreen' component={MainStackNavigator}
        options={({route})=>({
          tabBarIcon: ({ size, color}) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
          tabBarStyle: hiddenRoutes.includes(getFocusedRouteNameFromRoute(route) ?? "") ? { display: "none" } : {}
        })} />
      <Tab.Screen name='QuizzScreen' component={QuizzStackNavigator}
        options={({route})=>({
          tabBarIcon: ({ size, color}) => (
            <MaterialIcons name="quiz" size={size} color={color} />
          ),
          tabBarStyle: hiddenRoutes.includes(getFocusedRouteNameFromRoute(route) ?? "") ? { display: "none" } : {}
        })} />
      <Tab.Screen name='MiniApp' component={MiniAppStackNavigator}
        options={({route}) => ({
            tabBarIcon: ({ size, color }) => (
              <MaterialIcons name="list-alt" size={size} color={color} />
            ),
            tabBarStyle: hiddenRoutes.includes(getFocusedRouteNameFromRoute(route) ?? "") ? { display: "none" } : {}
        })}
      />
      <Tab.Screen name='ProfileScreen' component={ProfileStackNavigator}
        options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialIcons name="account-circle" size={size} color={color} />
            ),
          }}
      />
          
    </Tab.Navigator>
  )
}

export default BottomTabNavigation
