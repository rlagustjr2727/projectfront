import React, { useState } from 'react';
// import SearchResultPage from './components/Header/SearchResultPage';
// import SearchPage from './components/Header/SearchPage';
import './App.css';
import Container from './layout/Container';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BoardList from './components/board/BoardList';
import RegisterForm from './components/login/RegisterForm';
import LoginForm from './components/login/LoginForm';
import BoardDetail from './components/board/BoardDetail'; 
// import LoginHeader from './layout/LoginHeader/LoginHeader';
import BoardCreate from './components/board/BoardCreate';
import WhiskyEvents from './components/WhiskyEvent/WhiskyEvents';
import MyPage from './components/mypage/MyPage';
import {MAIN_PATH, LOGIN_PATH, REGISTER_PATH, BOARD_PATH, BOARD_WRITE_PATH, BOARD_DETAIL_PATH, BOARD_CATEGORY_PATH, WBOARD_PATH, SEARCH_PATH, MYPAGE_PATH, NEWS_PATH} from './constant'
import WhiskeyBoard from './components/WhiskeyBoard/WhiskeyBoard';
import HomePage from './components/board/HomePage';
import SearchResultPage from './layout/Header/SearchResultPage';
import { useEffect } from 'react';
import axios from 'axios';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  return (
    <BrowserRouter>
      <Container isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
        <Routes>
          <Route path={MAIN_PATH()} element={<HomePage />} />
          <Route path={LOGIN_PATH()} element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} />
          <Route path={REGISTER_PATH()} element={<RegisterForm />} />
          <Route path={MYPAGE_PATH()} element={<MyPage />} />
          <Route path={BOARD_PATH()} element={<BoardList />} />
          <Route path={BOARD_CATEGORY_PATH(':category')} element={<BoardList />} />
          <Route path={BOARD_WRITE_PATH()} element={<BoardCreate />} />
          <Route path={BOARD_DETAIL_PATH(':seq')}element={<BoardDetail />} />
          <Route path={WBOARD_PATH()} element={<WhiskeyBoard />} />
          <Route path={NEWS_PATH()} element={<WhiskyEvents />} />
          <Route path={SEARCH_PATH(':keyword')} element={<SearchResultPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;