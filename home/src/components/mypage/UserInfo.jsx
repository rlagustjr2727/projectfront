import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserInfo.css';

const UserInfo = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token'); // 또는 다른 방법으로 토큰을 가져옴
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            try {
                const response = await axios.get('/api/auth/userinfo', config);
                setUser(response.data);
            } catch (error) {
                console.error('유저 정보를 가져오는데 실패했습니다.', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching user data: {error.message}</p>;

    return (
        <div className="user-info">
            {user && (
                <>
                    <img className="profile-image" src={user.userProfileImage || 'default-profile.png'} alt="Profile" />
                    <p>아이디: {user.userId}</p>
                    <p>닉네임: {user.userNickName}</p>
                    <p>전화번호: {user.userPhoneNum}</p>
                    <p>이메일: {user.userEmail}</p>
                </>
            )}
        </div>
    );
};

export default UserInfo;
