import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './LoginForm.css';

function LoginForm() {
    const [loginData, setLoginData] = useState({
        userId: '',
        userPassword: ''
    });

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = (e) => {
        e.preventDefault();

        axios.post('/api/users/login', loginData, { withCredentials: true })
        .then(response => {
            setPopupMessage('로그인 성공');
            setShowPopup(true);
            setTimeout(() => {
                navigate('/'); // 로그인 성공 후 메인 페이지로 이동
            }, 3000);
        })
        .catch(error => {
            setPopupMessage('로그인 실패: ' + (error.response?.data || error.message));
            setShowPopup(true);
        });
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="LoginForm">
            <h1>로그인</h1>
            <form onSubmit={handleLogin}>
                <label>
                    아이디:
                    <input type="text" name="userId" value={loginData.userId} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    비밀번호:
                    <input type="password" name="userPassword" value={loginData.userPassword} onChange={handleChange} required />
                </label>
                <br />
                <button type="submit">로그인</button>
            </form>
            {showPopup && (
                <div className="popup">
                    <div className="popup-inner">
                        <h2>{popupMessage}</h2>
                        <button onClick={closePopup}>팝업 닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginForm;
