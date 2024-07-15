<<<<<<< HEAD
import React, { useEffect } from 'react';
=======
import React from 'react';
>>>>>>> dc75dd2fcc590180fd3778bfeefd1c480aa81214
import { useLocation } from 'react-router-dom';
import LoginHeader from '../LoginHeader/LoginHeader';
import Header from '../Header/Header';
import Footer from '../Footer';
import Carousel from '../../components/Carousel/Carousel';
import axios from 'axios';

const Container = ({ children, isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/api/me', { withCredentials: true });
        if (response.status === 200) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setIsLoggedIn(false); // 세션이 없음을 확인한 경우
        } else {
          console.error('Error checking session:', error);
        }
      }
    };

    checkSession();
  }, [setIsLoggedIn]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/api/me', { withCredentials: true });
        if (response.status === 200) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setIsLoggedIn(false); // 세션이 없음을 확인한 경우
        } else {
          console.error('Error checking session:', error);
        }
      }
    };

    checkSession();
  }, [setIsLoggedIn]);



  return (
    <div id="container-box">
      <LoginHeader isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} handleLogout={handleLogout} />
      <Header />
      <div className="main-content">
        {location.pathname === '/' && <Carousel />}
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Container;
