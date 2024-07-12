import React from 'react';
import './LoginHeader.css';
import { Link, useNavigate } from 'react-router-dom';

const LoginHeader = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        alert('로그아웃 되었습니다.');
        navigate('/');
    };

    return (
        <div className="loginHeader">
            <h4 className="main-title"><Link to="/">주 주 총 회</Link></h4>
            <div className="right-section">
                {isLoggedIn ? (
                    <>
                        <p onClick={handleLogout}><span>로그아웃</span></p>
                        <p>|</p>
                        <div className='right-section-login'><Link to="/mypage"><span>마이페이지</span></Link></div>
                    </>
                ) : (
                    <>
                        <div className='right-section-login'><Link to="/login"><span>로그인</span></Link></div>
                        <p>|</p>
                        <p><Link to="/register">회원가입</Link></p>
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginHeader;
