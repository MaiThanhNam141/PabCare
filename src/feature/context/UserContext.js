import React, { createContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        try {
            const unsubscribe = auth().onAuthStateChanged(user => {
                if(user){
                    setUserLoggedIn(user);
                    setLoading(false);
                }
                else {
                    setUserLoggedIn(false);
                    setLoading(false)
                }
            });
            return () => unsubscribe();
        } catch (error) {
            console.log("UserContext: ", error);
        }
    }, []);

    return (
        <UserContext.Provider value={{ userLoggedIn, setUserLoggedIn, loading }}>
            {children}
        </UserContext.Provider>
    );
};
