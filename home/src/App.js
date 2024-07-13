import React, { useState } from 'react';
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
import LoginSuccess from './components/login/LoginSuccess';
import LoginFail from './components/login/LoginFail';
// import LoginHeader from './layout/LoginHeader/LoginHeader';
import BoardCreate from './components/board/BoardCreate';
import WhiskyEvents from './components/WhiskyEvent/WhiskyEvents';
import MyPage from './components/mypage/MyPage';
import {MAIN_PATH, AUTH_PATH, USER_PATH} from './constant'
import BoardUpdate from './components/board/BoardUpdate';
import WhiskeyBoard from './components/WhiskeyBoard/WhiskeyBoard';
import HomePage from './components/board/HomePage';
import SearchResultPage from './layout/Header/SearchResultPage';
import RegisterSuccess from './components/login/RegisterSuccess'; // 회원가입 성공 페이지 추가
import RegisterFail from './components/login/RegisterFail'; // 회원가입 실패 페이지 추가


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  

  return (
    <BrowserRouter>
      <Container isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
        <Routes>
          <Route path='/login' element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='/registerForm' element={<RegisterForm />} />
          <Route path='/board' element={<BoardList />} />
          <Route path='/board/:category' element={<BoardList />} />
          <Route path='/board/write' element={<BoardCreate />} />
          <Route path='/loginSuccess' element={<LoginSuccess />} />
          <Route path='/loginFail' element={<LoginFail />} />
          <Route path='/registerSuccess' element={<RegisterSuccess />} />
          <Route path='/registerFail' element={<RegisterFail />} />
          <Route path={AUTH_PATH()} element={<Authentication />} />
          <Route path={USER_PATH()} element={<User />} />
          <Route path='/whisky/events' element={<WhiskyEvents />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path='/board/write' element={<BoardCreate />} />
          <Route path='/board' element={<BoardList />} />
          <Route path='/board/:category' element={<BoardList />} />
          <Route path="/board/detail/:seq" element={<BoardDetail />} />
          <Route path='/board/update/:seq' element={<BoardUpdate />} />
          <Route path='/Wboard' element={<WhiskeyBoard/>} /> {/* 추가 */}
          <Route path='/wboard/create' element={<WboardCreate />} /> {/* 추가 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search/:keyword" element={<SearchResultPage />} />
        </Routes>
      </Container>
    </BrowserRouter>



  );
}

export default App;