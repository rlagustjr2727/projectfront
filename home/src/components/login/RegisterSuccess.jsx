import React from "react";
import { useNavigate } from "react-router-dom";
import './Popup.css';

function RegisterSuccess() {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/'); // 홈 페이지로 이동
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <h1>회원가입 성공</h1>
                <p>회원가입이 성공적으로 완료되었습니다.</p>
                <button onClick={handleClose}>닫기</button>
            </div>
        </div>
    );
}

export default RegisterSuccess;
