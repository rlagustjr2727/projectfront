import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.post('/api/auth/logout', {}, { withCredentials: true })
            .then(response => {
                alert('로그아웃 성공');
                navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
            })
            .catch(error => {
                alert('로그아웃 실패: ' + (error.response?.data?.message || error.message));
            });
    };

    return (
        <div>
            <h2>로그아웃</h2>
            <button onClick={handleLogout}>로그아웃</button>
        </div>
    );
}

export default Logout;
