import React from "react";
import { useNavigate } from 'react-router-dom';
import './Popup.css';

function LoginFail() {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/login'); // 로그인 페이지로 이동
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h1>로그인 실패</h1>
                <p>아이디 또는 비밀번호가 잘못되었습니다.</p>
                <button onClick={handleClose}>닫기</button>
            </div>
        </div>
    );
}

export default LoginFail;