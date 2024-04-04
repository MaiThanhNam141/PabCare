import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native"
import { MainStackNavigator, ProfileStackNavigator, QuizzStackNavigator, MiniAppStackNavigator } from "./StackNavigator";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

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
      tabBarHideOnKeyboard: true,
      tabBarStyle:{
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        overflow:"hidden",
        backgroundColor:"#fff",
        height:60,
      },
    }}>
      <Tab.Screen name='HomeScreen' component={MainStackNavigator}
        options={{
          tabBarIcon: ({ size, color}) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }} />
      <Tab.Screen name='QuizzScreen' component={QuizzStackNavigator}
        options={{
            tabBarIcon: ({ size, color }) => (
              <MaterialIcons name="chat-bubble-outline" size={size} color={color} />
            ),
          }}/>
      <Tab.Screen name='MiniApp' component={MiniAppStackNavigator}
        options={({route}) => ({
            tabBarIcon: ({ size, color }) => (
              <MaterialIcons name="list-alt" size={size} color={color} />
            ),
            tabBarStyle: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? ""
              if (routeName === 'focus' || routeName === 'todo' || routeName === 'diary') {
                return { display: "none" }
              }
              return
            })(route)
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
