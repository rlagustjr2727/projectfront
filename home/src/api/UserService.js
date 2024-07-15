import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const register = (user) => {
<<<<<<< HEAD
  return axios.post(`${API_BASE_URL}/register`, user);
};

// 로그인 함수에서 로컬 스토리지에 토큰 저장 부분 제거
const login = async (userId, userPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { userId, userPassword });
=======
  return axios.post(`${API_BASE_URL}/register`, user, { withCredentials: true });
};

const login = async (userId, userPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { userId, userPassword }, { withCredentials: true });
>>>>>>> dc75dd2fcc590180fd3778bfeefd1c480aa81214
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

const logout = () => {
  return axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
};

const getCurrentUser = () => {
  return axios.get(`${API_BASE_URL}/me`, { withCredentials: true });
};

const UserService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default UserService;
