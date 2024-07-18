// src/api/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import defaultProfileImage from '../assets/image/default-profile-image.png';  // 이미지 import

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userProfileImage: defaultProfileImage,
    userNickName: '',
    userEmail: '',
    userPhoneNum: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/me', { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
