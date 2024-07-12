import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/comments';

axios.interceptors.request.use(request => {
  const token = localStorage.getItem('token');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

const getCommentsByBoardSeq = (boardSeq) => {
  return axios.get(`${API_BASE_URL}/board/${boardSeq}`);
};

const createComment = (comment) => {
  return axios.post(API_BASE_URL, comment);
};

const updateComment = (id, comment) => {
  return axios.put(`${API_BASE_URL}/${id}`, comment);
};

const deleteComment = (id) => {
  return axios.delete(`${API_BASE_URL}/${id}`);
};

const CommentService = {
  createComment,
  getCommentsByBoardSeq,
  updateComment,
  deleteComment,
};

export default CommentService;
