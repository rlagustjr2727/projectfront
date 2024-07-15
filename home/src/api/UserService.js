import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const register = (user) => {
  return axios.post(`${API_BASE_URL}/register`, user);
};

const login = async (userId, userPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { userId, userPassword }, { withCredentials: true });
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
