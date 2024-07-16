import React, { useEffect, useState } from 'react';
import Carousel from './components/Carousel/Carousel';
// import SearchResultPage from './components/Header/SearchResultPage';
// import SearchPage from './components/Header/SearchPage';
import './App.css';
import Container from './layout/Container';
import Authentication from './views/Authentication';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import User from './views/User';
import BoardList from './components/board/BoardList';
import RegisterForm from './components/login/RegisterForm';
import LoginForm from './components/login/LoginForm';
import BoardDetail from './components/board/BoardDetail'; 
import BoardCreate from './components/board/BoardCreate';
import WhiskyEvents from './components/WhiskyEvent/WhiskyEvents';
import MyPage from './components/mypage/MyPage';
import {MAIN_PATH, AUTH_PATH, USER_PATH} from './constant'

import WhiskeyBoard from './components/WhiskeyBoard/WhiskeyBoard';
import HomePage from './components/board/HomePage';
import SearchResultPage from './layout/Header/SearchResultPage';
import axios from 'axios';
import NoticeList from './components/notice/NoticeList';
import NoticeCreate from './components/notice/NoticeCreate';
import NoticeDetail from './components/notice/NoticeDetail';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  return (
    <BrowserRouter>
      <Container isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
        <Routes>
          <Route path='/login' element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='/register' element={<RegisterForm />} />
          <Route path='/board' element={<BoardList />} />
          <Route path='/board/:category' element={<BoardList />} />
          <Route path='/board/write' element={<BoardCreate />} />
          <Route path={AUTH_PATH()} element={<Authentication />} />
          <Route path={USER_PATH()} element={<User />} />
          <Route path='/whisky/events' element={<WhiskyEvents />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/board/detail/:seq" element={<BoardDetail />} />
          <Route path='/Wboard' element={<WhiskeyBoard />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/search/:keyword" element={<SearchResultPage />} />
          <Route path="/notice" element={<NoticeList />} />
          <Route path="notice/write" element={<NoticeCreate />} />
          <Route path="/notice/detail/:seq" element={<NoticeDetail />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;