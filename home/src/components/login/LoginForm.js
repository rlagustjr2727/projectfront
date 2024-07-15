import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm({ setIsLoggedIn }) { // setIsLoggedIn props 추가
    const [loginData, setLoginData] = useState({ userId: '', userPassword: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', loginData); // 상대 경로 사용
            alert(response.data);
            setIsLoggedIn(true); // 로그인 성공 시 상태 변경
            navigate('/'); // 로그인 성공 시 홈으로 이동
        } catch (error) {
            alert("Login failed!");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="userId" value={loginData.userId} onChange={handleChange} placeholder="User ID" />
            <input type="password" name="userPassword" value={loginData.userPassword} onChange={handleChange} placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginForm;
