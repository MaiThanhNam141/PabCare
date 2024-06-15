import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native"
import { MainStackNavigator, ProfileStackNavigator, QuizzStackNavigator, MiniAppStackNavigator } from "./StackNavigator";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { UserContext } from "../feature/context/UserContext";

const Tab = createBottomTabNavigator()

const BottomTabNavigation = () => {
  const {userLoggedIn, loading} = React.useContext(UserContext);
  const hiddenRoutes = ['loginscreen', 'focus', 'todo', 'diary', 'mood', 'bmi', 'music', 'goldensleep', 'bmiresult', 'chatai', 'quiz', 'bdi', 'eq'];
  
  const getTabBarStyle = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "";
    if (hiddenRoutes.includes(routeName)) {
      return { display: "none" };
    }
    return {};
  };

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
