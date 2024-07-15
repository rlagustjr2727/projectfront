import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/mypage';

const getUserInfo = () => {
  return axios.get(`${API_BASE_URL}/userinfo`, { withCredentials: true });
};

const updateUserProfileImage = (image) => {
  const formData = new FormData();
  formData.append('image', image);
  return axios.post(`${API_BASE_URL}/updateProfileImage`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
};

const updateUser = (user) => {
  return axios.put(`${API_BASE_URL}/updateUser`, user, { withCredentials: true });
};

const MyPageService = {
  getUserInfo,
  updateUserProfileImage,
  updateUser,
};

export default MyPageService;
