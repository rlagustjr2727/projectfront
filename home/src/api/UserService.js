import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const register = (user) => {
  return axios.post(`${API_BASE_URL}/register`, user);
};

// 로그인 함수에서 로컬 스토리지에 토큰 저장 부분 제거
const login = async (userId, userPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { userId, userPassword });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

const UserService = {
  register,
  login,
};

export default UserService;
