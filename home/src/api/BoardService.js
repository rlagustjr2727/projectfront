import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/board';

// 인터셉터 제거, 세션 기반으로 설정

export const getRecentBoards = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recent`);
    return response.data || []; // 데이터가 없으면 빈 배열을 반환
  } catch (error) {
    console.error('Error fetching items:', error);
    return []; // 에러가 발생하면 빈 배열을 반환
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
