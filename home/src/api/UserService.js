import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

axios.interceptors.request.use(request => {
  const token = localStorage.getItem('token');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
    // Handle 401 error: redirect to login page or show a message
    console.error('Unauthorized, redirecting to login');
    alert('로그인이 필요합니다.');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

const checkVerificationStatus = (email) => {
  return axios.post(`${API_BASE_URL}/checkVerificationStatus`, { email });
};

const register = (user) => {
  return axios.post(`${API_BASE_URL}/register`, user);
};

const sendVerificationCode = (email, provider) => {
  return axios.post(`${API_BASE_URL}/sendVerificationCode`, { email, provider });
};

const verifyCode = (email, code) => {
  return axios.post(`${API_BASE_URL}/verifyCode`, { email, code });
};

const checkUserId = (userId) => {
  return axios.get(`${API_BASE_URL}/checkUserId`, { params: { userId } });
};

const checkUserNickName = (userNickName) => {
  return axios.get(`${API_BASE_URL}/checkUserNickName`, { params: { userNickName } });
};

const login = async (userId, userPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { userId, userPassword });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    } else {
      throw new Error('No token received');
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

const UserService = {
  checkVerificationStatus,
  register,
  sendVerificationCode,
  verifyCode,
  checkUserId,
  checkUserNickName,
  login,
};

export default UserService;
