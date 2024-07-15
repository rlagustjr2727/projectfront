import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/comments';

// 댓글 가져오기
const getCommentsByBoardSeq = (boardSeq) => {
  return axios.get(`${API_BASE_URL}/board/${boardSeq}`, { withCredentials: true });
};

// 댓글 생성
const createComment = (comment) => {
  return axios.post(API_BASE_URL, comment, { withCredentials: true });
};

// 댓글 수정
const updateComment = (id, comment) => {
  return axios.put(`${API_BASE_URL}/${id}`, comment, { withCredentials: true });
};

// 댓글 삭제
const deleteComment = (id) => {
  return axios.delete(`${API_BASE_URL}/${id}`, { withCredentials: true });
};

const CommentService = {
  createComment,
  getCommentsByBoardSeq,
  updateComment,
  deleteComment,
};

export default CommentService;
