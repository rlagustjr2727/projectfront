import React from 'react';
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
