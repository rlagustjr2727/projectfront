import React from "react";
import { useNavigate } from "react-router-dom";
import './Popup.css';

function RegisterSuccess() {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/');
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h1>회원가입 성공</h1>
                <button onClick={handleClose}>닫기</button>
            </div>
        </div>
    )
}

export default RegisterSuccess;