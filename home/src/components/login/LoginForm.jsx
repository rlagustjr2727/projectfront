import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../api/UserService';

function LoginForm({ setIsLoggedIn }) {
    const [loginData, setLoginData] = useState({ userId: '', userPassword: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await UserService.login(loginData.userId, loginData.userPassword);
            alert(response);
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
