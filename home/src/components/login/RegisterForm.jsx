import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterForm() {
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userNickName, setUserNickName] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userBirth, setUserBirth] = useState('');
    const [userPhoneNum, setUserPhoneNum] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("/api/users/register", {
                userId: userId,
                userName: userName,
                userNickName: userNickName,
                userPassword: userPassword,
                userEmail: userEmail,
                userBirth: userBirth,
                userPhoneNum: userPhoneNum,
            }, {
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                }
            });

            console.log('Registration successful:', response.data);
            navigate('/'); // 회원가입 성공 시 홈으로 이동
        } catch (error) {
            console.error('Failed to register:', error.message);
            // 실패 시 처리 로직 추가
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="userId">User ID:</label>
                <input
                    type="text"
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="userName">User Name:</label>
                <input
                    type="text"
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="userNickName">User Nickname:</label>
                <input
                    type="text"
                    id="userNickName"
                    value={userNickName}
                    onChange={(e) => setUserNickName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="userPassword">User Password:</label>
                <input
                    type="password"
                    id="userPassword"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="userEmail">User Email:</label>
                <input
                    type="email"
                    id="userEmail"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="userBirth">User Birth:</label>
                <input
                    type="date"
                    id="userBirth"
                    value={userBirth}
                    onChange={(e) => setUserBirth(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="userPhoneNum">User Phone Number:</label>
                <input
                    type="tel"
                    id="userPhoneNum"
                    value={userPhoneNum}
                    onChange={(e) => setUserPhoneNum(e.target.value)}
                />
            </div>
            <button type="submit">Register</button>
        </form>
    );
}

export default RegisterForm;
