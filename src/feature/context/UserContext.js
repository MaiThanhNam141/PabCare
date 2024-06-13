import React, { createContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userLoggedIn, setUserLoggedIn] = useState(null);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(user => {
          setUserLoggedIn(user)
          console.log(user)
        });
        return unsubscribe;
    }, []);

    return (
        <UserContext.Provider value={{ userLoggedIn, setUserLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
};
