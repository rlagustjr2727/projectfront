import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Popup.css';

function LoginSuccess() {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/'); // 인덱스 페이지로 이동
    };

    return (
        <div className="popup">
            <div className='popup-inner'>
                <h1>로그인 성공</h1>
                <button onClick={handleClose}>닫기</button>
            </div>
        </div>
    );
}

export default LoginSuccess;