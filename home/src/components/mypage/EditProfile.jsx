import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 사용
import './EditProfile.css';

const EditProfile = () => {
  const [user, setUser] = useState({
    userNickName: '',
    userEmail: '',
    userPhoneNum: '',
    userPassword: '',
  });

  const navigate = useNavigate(); // useNavigate 훅 초기화

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

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/users/user', user, { withCredentials: true });
      alert('Profile updated successfully');
      navigate('/'); 
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="edit-profile-container">
      <h1 className="edit-profile-title">회원정보수정</h1>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <label>
          닉네임:
          <input
            type="text"
            name="userNickName"
            value={user.userNickName}
            onChange={handleChange}
          />
        </label>
        <label>
          이메일:
          <input
            type="email"
            name="userEmail"
            value={user.userEmail}
            onChange={handleChange}
          />
        </label>
        <label>
          전화번호:
          <input
            type="text"
            name="userPhoneNum"
            value={user.userPhoneNum}
            onChange={handleChange}
          />
        </label>
        <label>
          비밀번호:
          <input
            type="password"
            name="userPassword"
            value={user.userPassword}
            onChange={handleChange}
            placeholder="새 비밀번호를 입력하세요"
          />
        </label>
        <button type="submit">수정</button>
      </form>
    </div>
  );
};

export default EditProfile;
