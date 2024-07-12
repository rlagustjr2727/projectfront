import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BoardService from '../../api/BoardService';
import {
  Container, TextField, Button, MenuItem, Select, InputLabel, FormControl, Box, Typography, Paper
} from '@mui/material';
import './BoardUpdate.css';

const BoardUpdate = () => {
  const { id } = useParams();
  const [board, setBoard] = useState({
    boardTitle: '',
    boardCategory: '',
    boardContent: '',
  });
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null); // 로그인한 사용자 정보
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/auth/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('User data:', response.data);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    if (isLoggedIn) {
      fetchUser();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await BoardService.getBoardBySeq(id);
        setBoard({
          boardTitle: response.data.boardTitle,
          boardCategory: response.data.boardCategory,
          boardContent: response.data.boardContent,
        });
      } catch (error) {
        console.error('Error fetching the board data!', error);
      }
    };

    fetchBoard();
  }, [id]);

  const handleChange = (e) => {
    setBoard({ ...board, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const boardData = {
      ...board,
      boardAuthor: user?.nickname || 'Anonymous', // 로그인한 사용자의 닉네임 사용
      profileImageUrl: user?.userProfileImage || null, // 로그인한 사용자의 프로필 이미지 사용
    };

    BoardService.updateBoard(id, boardData, image)
      .then(() => {
        navigate(`/board/detail/${id}`); // 게시글 상세 페이지로 리다이렉트
      })
      .catch(error => {
        console.error('Error updating the board!', error);
      });
  };

  return (
    <Container className="board-update-container">
      <Paper className="board-form-container" elevation={3}>
        <Typography variant="h4" gutterBottom>게시글 수정</Typography>
        <form onSubmit={handleUpdate} encType="multipart/form-data">
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
            <Button type="submit" variant="contained" color="primary" style={{ width: '100px' }}>수정하기</Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default BoardUpdate;
