import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './RegisterForm.css';

function RegisterForm() {
    const [formData, setFormData] = useState({
        userId: '',
        userName: '',
        userNickName: '',
        userPassword: '',
        userEmail: '',
        userDomain: 'gmail.com',
        userBirth: '',
        userPhoneNum1: '',
        userPhoneNum2: '',
        userPhoneNum3: ''
    });

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        const { userId, userName, userNickName, userPassword, userEmail, userDomain, userBirth, userPhoneNum1, userPhoneNum2, userPhoneNum3 } = formData;
        const userPhoneNum = `${userPhoneNum1}-${userPhoneNum2}-${userPhoneNum3}`;
        const fullEmail = `${userEmail}@${userDomain}`;

        if (!userId || !userName || !userNickName || !userPassword || !fullEmail || !userBirth || !userPhoneNum) {
            setPopupMessage('모든 필드를 채워주세요.');
            setShowPopup(true);
            return;
        }

        axios.post('/api/users/register', {
            userId,
            userName,
            userNickName,
            userPassword,
            userEmail: fullEmail,
            userDomain,
            userBirth,
            userPhoneNum
        }, { withCredentials: true })
        .then(response => {
            setPopupMessage('회원가입 성공');
            setShowPopup(true);
            setTimeout(() => {
                navigate('/login'); // 회원가입 성공 후 /login 경로로 이동
            }, 3000);
        })
        .catch(error => {
            setPopupMessage('회원가입 실패: ' + (error.response?.data || error.message));
            setShowPopup(true);
            setTimeout(() => {
                navigate('/registerFail'); // 회원가입 실패 시 실패 페이지로 이동
            }, 3000);
        });
    };

    const checkUserId = () => {
        axios.get('/api/users/checkUserId', {
            params: { userId: formData.userId },
            withCredentials: true
        })
        .then(response => {
            if (response.data) {
                setPopupMessage('아이디가 이미 존재합니다.');
            } else {
                setPopupMessage('아이디를 사용할 수 있습니다.');
            }
            setShowPopup(true);
        })
        .catch(error => {
            setPopupMessage('아이디 중복 확인 중 오류가 발생했습니다.');
            setShowPopup(true);
        });
    };

    const checkUserNickName = () => {
        axios.get('/api/users/checkUserNickName', {
            params: { userNickName: formData.userNickName },
            withCredentials: true
        })
        .then(response => {
            if (response.data) {
                setPopupMessage('닉네임이 이미 존재합니다.');
            } else {
                setPopupMessage('닉네임을 사용할 수 있습니다.');
            }
            setShowPopup(true);
        })
        .catch(error => {
            setPopupMessage('닉네임 중복 확인 중 오류가 발생했습니다.');
            setShowPopup(true);
        });
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="RegisterForm">
            <h1>회원가입</h1>
            <form onSubmit={handleRegister}>
                <label>
                    아이디:
                    <input type="text" name="userId" value={formData.userId} onChange={handleChange} required />
                    <button type="button" onClick={checkUserId}>중복확인</button>
                </label>
                <br />
                <label>
                    이름:
                    <input type="text" name="userName" value={formData.userName} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    닉네임:
                    <input type="text" name="userNickName" value={formData.userNickName} onChange={handleChange} required />
                    <button type="button" onClick={checkUserNickName}>중복확인</button>
                </label>
                <br />
                <label>
                    비밀번호:
                    <input type="password" name="userPassword" value={formData.userPassword} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    이메일:
                    <input type="text" name="userEmail" value={formData.userEmail} onChange={handleChange} required />@
                    <select name="userDomain" value={formData.userDomain} onChange={handleChange}>
                        <option value="naver.com">naver.com</option>
                        <option value="gmail.com">gmail.com</option>
                    </select>
                </label>
                <br />
                <label>
                    생년월일:
                    <input type="date" name="userBirth" value={formData.userBirth} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    전화번호:
                    <input type="text" name="userPhoneNum1" value={formData.userPhoneNum1} onChange={handleChange} required /> -
                    <input type="text" name="userPhoneNum2" value={formData.userPhoneNum2} onChange={handleChange} required /> -
                    <input type="text" name="userPhoneNum3" value={formData.userPhoneNum3} onChange={handleChange} required />
                </label>
                <br />
                <button type="submit">회원가입</button>
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

export default RegisterForm;
