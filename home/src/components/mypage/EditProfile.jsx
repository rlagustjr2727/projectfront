import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './EditProfile.css';

const EditProfile = () => {
    const [user, setUser] = useState({
        userId: '',
        userPassword: '',
        userName: '',
        userNickName: '',
        userEmail: '',
        userPhoneNum: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/auth/userinfo');
                console.log('User Data:', response.data); // 유저 데이터 로그로 확인
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/auth/update', user);
            navigate('/');
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div className="main-container">
            <header className="header">
                <h1>My Page</h1>
            </header>
            <div className="content-container">
                <div className="edit-profile-container">
                    <form className="edit-profile-form" onSubmit={handleSubmit}>
                        <h2 className="edit-profile-title">내 정보 수정</h2>
                        <div className="edit-profile-field">
                            <label htmlFor="userId">아이디</label>
                            <input
                                type="text"
                                id="userId"
                                name="userId"
                                value={user.userId}
                                readOnly
                            />
                        </div>
                        <div className="edit-profile-field">
                            <label htmlFor="userPassword">비밀번호</label>
                            <input
                                type="password"
                                id="userPassword"
                                name="userPassword"
                                value={user.userPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="edit-profile-field">
                            <label htmlFor="userName">이름</label>
                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                value={user.userName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="edit-profile-field">
                            <label htmlFor="userNickName">닉네임</label>
                            <input
                                type="text"
                                id="userNickName"
                                name="userNickName"
                                value={user.userNickName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="edit-profile-field">
                            <label htmlFor="userEmail">이메일</label>
                            <input
                                type="email"
                                id="userEmail"
                                name="userEmail"
                                value={user.userEmail}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="edit-profile-field">
                            <label htmlFor="userPhoneNum">전화번호</label>
                            <input
                                type="text"
                                id="userPhoneNum"
                                name="userPhoneNum"
                                value={user.userPhoneNum}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="edit-profile-buttons">
                            <button type="submit" className="edit-profile-button save-button">수정</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
