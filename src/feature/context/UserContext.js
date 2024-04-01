import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    return (
        <UserContext.Provider value={{ userLoggedIn, setUserLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
};
