import './LoginHeader.css';
import { Link, useNavigate } from 'react-router-dom';
import { MAIN_PATH } from '../../constant';
import React, { useState, useEffect, useRef } from 'react';
import DetailList from '../Header/DetailList';
import axios from 'axios';

const LoginHeader = ({ isLoggedIn, setIsLoggedIn }) => {
    const [userInput, setUserInput] = useState('');
    const [trendingList, setTrendingList] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [showPopularSearch, setShowPopularSearch] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    const onLogoutClickHandler = async () => {
        try {
            await axios.post('http://localhost:8080/api/logout', {}, { withCredentials: true }); // 세션 로그아웃 요청
            setIsLoggedIn(false); // 상태 업데이트
            navigate('/'); // 로그아웃 후 홈으로 이동
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // 로고 클릭 이벤트 처리 함수
    const onLogoClickHandler = () => {
        navigate(MAIN_PATH());
    };

    const handleInputClick = () => {
        setShowPopularSearch(true);
        setIsSearchActive(true);
    };

    const handleItemClick = (keyword) => {
        navigate(`/search/${keyword}`);
    };

    const handleUserInputChange = (event) => {
        const value = event.target.value;
        setUserInput(value);
        setShowPopularSearch(value === '');
    };

    const handleSearchClick = () => {
        console.log('검색: ', userInput);
        navigate(`/search/${userInput}`);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    const onMyPageClickHandler = () => {
        navigate('/mypage');
    };

    const onSignUpClickHandler = () => {
        navigate('/register');
    };

    const onSignInClickHandler = () => {
        navigate('/login');
    };

    return (
        <div className="loginHeader">
            <div className='login-header-container'>
                <div className='header-left-box' onClick={onLogoClickHandler}>
                    <div className='icon-box'>
                        <div className='icon whisky-logo-3'></div>
                    </div>
                </div>
            </div>    
            <div className="right-section">
                {isLoggedIn ? (
                    <>
                        <div className='right-section-login' onClick={onMyPageClickHandler}>마이페이지</div>
                        <p>|</p>
                        <div className='right-section-login' onClick={onLogoutClickHandler}>로그아웃</div>
                    </>
                ) : (
                    <>
                        <div className='right-section-login' onClick={onSignInClickHandler}>로그인</div>
                        <p>|</p>
                        <div className='right-section-login' onClick={onSignUpClickHandler}>회원가입</div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginHeader;
