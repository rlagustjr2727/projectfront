import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoginHeader from '../LoginHeader/LoginHeader';
import Header from '../Header/Header';
import Footer from '../Footer';
import Carousel from '../../components/Carousel/Carousel';

const Container = ({ children, isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();

  return (
    <>
      <LoginHeader isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Header />
      {location.pathname === '/' && <Carousel />}
      <div className="main-content">
        {children}
      </div>
      <Footer />
    </>
  );
}

export default Container;
