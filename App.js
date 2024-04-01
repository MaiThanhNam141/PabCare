import React from 'react';
import BottomTabNavigation from './src/navigation/BottomTabNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './src/feature/context/UserContext';

export default App = () => {
  return(
    <NavigationContainer>
      <UserProvider>
        <BottomTabNavigation />
      </UserProvider>
    </NavigationContainer>
  )
}

