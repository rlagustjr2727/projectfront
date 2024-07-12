import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/board';

axios.interceptors.request.use(request => {
  const token = localStorage.getItem('token');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Starting Request', request);
  return request;
});

axios.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
    console.error('Unauthorized');
  }
  return Promise.reject(error);
});

export const getRecentBoards = async () => {
  try {
      const response = await axios.get(`${API_BASE_URL}/api/board/recent`);
      return response.data;
  } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
  }
};

const getBoards = (page, size) => {
  return axios.get(`${API_BASE_URL}?page=${page}&size=${size}`);
};

const getBoardBySeq = (seq) => {
  return axios.get(`${API_BASE_URL}/${seq}`);
};

const createBoard = (board, image) => {
  const formData = new FormData();
  formData.append('board', new Blob([JSON.stringify(board)], { type: 'application/json' }));
  if (image) {
    formData.append('image', image);
  }
  return axios.post(API_BASE_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const updateBoard = (seq, formData) => {
  return axios.put(`${API_BASE_URL}/${seq}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const deleteBoard = (seq) => {
  return axios.delete(`${API_BASE_URL}/${seq}`);
};

const searchBoardsByTitle = (keyword, page, size) => {
  return axios.get(`${API_BASE_URL}/search?keyword=${keyword}&page=${page}&size=${size}`);
};

const getBoardsByCategory = (category, page, size) => {
  return axios.get(`${API_BASE_URL}/category`, {
    params: {
      category,
      page,
      size
    }
  });
};

const incrementViews = (seq) => {
  return axios.post(`${API_BASE_URL}/increment-views/${seq}`);
};

const likeBoard = (seq) => {
  return axios.post(`${API_BASE_URL}/like/${seq}`);
};

const unlikeBoard = (seq) => {
  return axios.post(`${API_BASE_URL}/unlike/${seq}`);
};

const BoardService = {
  getBoards,
  getRecentBoards,
  getBoardBySeq,
  createBoard,
  updateBoard,
  deleteBoard,
  searchBoardsByTitle,
  getBoardsByCategory,
  incrementViews,
  likeBoard,
  unlikeBoard
};

export default BoardService;
