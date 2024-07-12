import React from "react";
import { useNavigate } from "react-router-dom";
import './Popup.css';

function RegisterFail() {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/registerForm');
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h1>회원가입 실패</h1>
                <p>회원가입 중 오류가 발생했습니다.</p>
                <button onClick={handleClose}>닫기</button>
            </div>
        </div>
    );
}

export default RegisterFail;
