import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserInfo.css';

const UserInfo = () => {
  const [user, setUser] = useState({
    userProfileImage: '/images/userProfileImage.png',
    userNickName: '',
    userEmail: '',
    userPhoneNum: '',
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/api/me', { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('/api/users/update-profile-image', formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setUser(response.data); // 업데이트된 유저 정보 반영
      } catch (error) {
        console.error('Failed to update profile image:', error);
      }
    }
  };

  return (
    <div className="user-info-container">
      <label htmlFor="profile-image-upload">
        <img
          src={user.userProfileImage || '/images/userProfileImage.png'}
          alt="User Profile"
          className="user-profile-image"
        />
      </label>
      <input
        type="file"
        id="profile-image-upload"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
      <div className="user-info-details">
        <h2>{user.userNickName}</h2>
        <p>Email: {user.userEmail}</p>
        <p>Phone: {user.userPhoneNum}</p>
      </div>
    </div>
  );
};

export default UserInfo;
