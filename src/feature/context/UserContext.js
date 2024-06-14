import React, { createContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(user => {
            setUserLoggedIn(user);
            setLoading(false);
            console.log("onAuthStateChanged: ", !!user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ userLoggedIn, setUserLoggedIn, loading }}>
            {children}
        </UserContext.Provider>
    );
};
