import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserService from '../../api/UserService';
import BoardService from '../../api/BoardService';
import {
  Container, TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Typography, Paper
} from '@mui/material';
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
      <Paper className="board-form-container" elevation={3}>
        <Typography variant="h4" gutterBottom>게시글 작성</Typography>
        <form onSubmit={handleCreate} encType="multipart/form-data">
          <Box my={2}>
            <FormControl fullWidth required>
              <InputLabel>카테고리</InputLabel>
              <Select
                name="boardCategory"
                value={board.boardCategory}
                onChange={handleChange}
              >
                <MenuItem value="자유 게시판">자유 게시판</MenuItem>
                <MenuItem value="나눔 게시판">나눔 게시판</MenuItem>
                <MenuItem value="장터 게시판">장터 게시판</MenuItem>
                <MenuItem value="정보 게시판">정보 게시판</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box my={2}>
            <TextField
              label="제목"
              name="boardTitle"
              value={board.boardTitle}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>
          <Box my={2}>
            <TextField
              label="내용"
              name="boardContent"
              value={board.boardContent}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={4}
            />
          </Box>
          <Box my={2}>
            <input
              type="file"
              name="boardImage"
              onChange={handleImageChange}
            />
          </Box>
          <Box my={2} display="flex" justifyContent="left">
            <Button type="submit" variant="contained" color="primary" style={{ width: '100px' }}>작성하기</Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default BoardCreate;
