import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserService from '../../api/UserService';
import BoardService from '../../api/BoardService';
import { Container, Box, Typography } from '@mui/material';
import './BoardCreate.css';

const BoardCreate = () => {
  const [board, setBoard] = useState({
    boardTitle: '',
    boardCategory: '',
    boardViews: 0,
    boardContent: '',
  });
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UserService.getCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data', error);
        navigate('/login', { state: { from: location } });
      }
    };

    fetchUser();
  }, [navigate, location]);

  const handleChange = (e) => {
    setBoard({ ...board, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login', { state: { from: location } });
      return;
    }

    const boardData = {
      ...board,
      boardAuthor: user.userNickName || 'Anonymous',
      profileImageUrl: user.userProfileImage || null,
    };

    try {
      await BoardService.createBoard(boardData, image);
      navigate('/board', { state: { newBoard: true } });
    } catch (error) {
      console.error('Error creating the board!', error);
    }
  };

  if (!user) {
    return null; // 로그인 상태가 확인될 때까지 아무것도 렌더링하지 않음
  }

  return (
    <Container className="board-create-container">
      <Box className="board-form-container">
        <div className="create-form-title">게시글 작성</div>
        <form onSubmit={handleCreate} encType="multipart/form-data">
          <Box my={2} className="form-group">
            <label htmlFor="boardCategory">카테고리</label>
            <select
              name="boardCategory"
              value={board.boardCategory}
              onChange={handleChange}
              required
            >
              <option value="" disabled>카테고리를 선택하세요</option>
              <option value="자유 게시판">자유 게시판</option>
              <option value="나눔 게시판">나눔 게시판</option>
              <option value="장터 게시판">장터 게시판</option>
              <option value="정보 게시판">정보 게시판</option>
            </select>
          </Box>
          <Box my={2} className="form-group">
            <label htmlFor="boardTitle">제목</label>
            <input
              id="boardTitle"
              name="boardTitle"
              value={board.boardTitle}
              onChange={handleChange}
              placeholder='제목 입력'
              required
            />
          </Box>
          <Box my={2} className="form-group">
            <label htmlFor="boardContent">내용</label>
            <textarea
              id="boardContent"
              name="boardContent"
              value={board.boardContent}
              onChange={handleChange}
              rows="20"
              placeholder="여기에 작성하세요"
              required
            />
          </Box>
          <Box my={2} className="form-group">
            <input
              type="file"
              name="boardImage"
              onChange={handleImageChange}
            />
          </Box>
          <Box my={2} display="flex" justifyContent="flex-end">
            <button type="submit" className="submit-button">작성하기</button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default BoardCreate;
