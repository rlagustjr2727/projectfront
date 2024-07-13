import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoginHeader from '../LoginHeader/LoginHeader';
import Header from '../Header/Header';
import Footer from '../Footer';
import Carousel from '../../components/Carousel/Carousel';

const Container = ({ children, isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();

  return (
    <div id="container-box">
      <LoginHeader isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
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
