// src/context/ProfileContext.js
import React, { createContext, useState } from "react";

export const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
