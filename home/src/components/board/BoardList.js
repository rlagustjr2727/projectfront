import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import BoardService from '../../api/BoardService';
import Pagination from '@mui/material/Pagination';
import {
  Container, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress,
  Box, Paper, TableContainer, TextField, Button, Grid, List, ListItem, ListItemText, Typography,
  FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Image } from '@mui/icons-material';
import LoginForm from '../login/LoginForm';
import './BoardList.css';

const BoardList = () => {
  const { category } = useParams();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [searchOption, setSearchOption] = useState('title');
  const [selectedCategory, setSelectedCategory] = useState(category || '전체 게시판');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const pageSize = 5;
  const navigate = useNavigate();
  const location = useLocation();

  const fetchBoards = useCallback(() => {
    setLoading(true);
    BoardService.getBoards(page - 1, pageSize).then((response) => {
      setBoards(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    }).catch((error) => {
      console.error('게시글 데이터를 불러오는 중 에러 발생!', error);
      setLoading(false);
    });
  }, [page]);

  const fetchBoardsByCategory = useCallback((category) => {
    setLoading(true);
    BoardService.getBoardsByCategory(category, page - 1, pageSize).then((response) => {
      setBoards(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    }).catch((error) => {
      console.error('카테고리별 게시글 데이터를 불러오는 중 에러 발생!', error);
      setLoading(false);
    });
  }, [page]);

  const handleSearch = useCallback(() => {
    setLoading(true);
    if (searchOption === 'title') {
      BoardService.searchBoardsByTitle(keyword, page - 1, pageSize).then((response) => {
        setBoards(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      }).catch((error) => {
        console.error('검색 중 에러 발생!', error);
        setLoading(false);
      });
    } else {
      BoardService.searchBoardsByTitleAndContent(keyword, page - 1, pageSize).then((response) => {
        setBoards(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      }).catch((error) => {
        console.error('검색 중 에러 발생!', error);
        setLoading(false);
      });
    }
  }, [keyword, page, pageSize, searchOption]);

  const onSearchWordKeyDownHandler = (event) => {
    if (event.key !== 'Enter') return;
    handleSearch();
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setPage(1);
    navigate(`/board/${category}`);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCreate = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      setShowLoginDialog(true);
      return;
    }
    navigate('/board/write');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginDialog(false);
  };

  const getCategoryAbbreviation = (category) => {
    switch (category) {
      case '자유 게시판':
        return '자유';
      case '나눔 게시판':
        return '나눔';
      case '장터 게시판':
        return '장터';
      case '정보 게시판':
        return '정보';
      default:
        return category;
    }
  };

  useEffect(() => {
    if (selectedCategory === '전체 게시판' || !selectedCategory) {
      fetchBoards();
    } else {
      fetchBoardsByCategory(selectedCategory);
    }
  }, [fetchBoards, fetchBoardsByCategory, selectedCategory, page]);

  useEffect(() => {
    if (location.state && location.state.newBoard) {
      setPage(1);
    }
  }, [location]);

  return (
    <Box display="flex" className="board-list-container">
      <Box className="board-list">
        <Paper>
          <Typography variant="h6" style={{ padding: '14px' }}>게시판 목록</Typography>
          <List>
            {['전체 게시판', '자유 게시판', '나눔 게시판', '장터 게시판', '정보 게시판'].map((text) => (
              <ListItem button key={text} onClick={() => handleCategorySelect(text)}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
      <Container className="board-content" maxWidth={false} disableGutters>
        <Grid container spacing={10}>
          <Grid item xs={12}>
            <Box mt={2}>
              <Typography variant="h5">{selectedCategory}</Typography>
            </Box>
            {loading ? (
              <Box className="loading-box">
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} className="table-container">
                  <Table className="board-table">
                    <TableHead className="board-table-header">
                      <TableRow>
                        {selectedCategory === '전체 게시판' ? (
                          <TableCell style={{ width: '20%', fontSize: '18px' }}></TableCell>
                        ) : (
                          <TableCell style={{ fontSize: '18px' }}>번호</TableCell>
                        )}
                        <TableCell style={{ fontSize: '18px' }}>제목</TableCell>
                        <TableCell style={{ fontSize: '18px' }}>작성자</TableCell>
                        <TableCell style={{ fontSize: '18px' }}>작성일</TableCell>
                        <TableCell style={{ fontSize: '18px' }}>조회수</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {boards.map((board, index) => (
                        <TableRow key={board.boardSeq}>
                          {selectedCategory === '전체 게시판' ? (
                            <TableCell>
                              <Link to="#" onClick={() => handleCategorySelect(board.boardCategory)} className="category-link">
                                {board.boardCategory}
                              </Link>
                            </TableCell>
                          ) : (
                            <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                          )}
                          <TableCell>
                            <Link to={`/board/detail/${board.boardSeq}`} className="board-link">
                              <Box className="board-title-container">
                                [{getCategoryAbbreviation(board.boardCategory)}] {board.boardTitle}
                                {board.boardImage && <Image className="icon image-icon" />}
                                {board.commentCount > 0 && (
                                  <span className="comment-count">
                                    ({board.commentCount})
                                  </span>
                                )}
                              </Box>
                            </Link>
                          </TableCell>
                          <TableCell>{board.boardAuthor}</TableCell>
                          <TableCell>{new Date(board.boardDate).toLocaleDateString()}</TableCell>
                          <TableCell>{board.boardViews}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box className="pagination-create-container" display="flex" justifyContent="space-between" alignItems="center">
                  <Box className="pagination-container">
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                  <Box className="create-button-container">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleCreate}
                      className="create-button"
                      style={{ marginLeft: '10px' }}
                    >
                      게시글 작성
                    </Button>
                  </Box>
                </Box>
                <Box className="search-box" mt={2}>
                  <FormControl variant="outlined" style={{ minWidth: '150px', marginRight: '8px' }}>
                    <InputLabel>검색 옵션</InputLabel>
                    <Select
                      value={searchOption}
                      onChange={(e) => setSearchOption(e.target.value)}
                      label="검색 옵션"
                    >
                      <MenuItem value="title">제목</MenuItem>
                      <MenuItem value="title+content">제목+내용</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="검색어"
                    variant="outlined"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={onSearchWordKeyDownHandler}
                    fullWidth
                    style={{ fontSize: '16px' }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    style={{ marginLeft: '8px', fontSize: '13px' }}
                  >
                    검색
                  </Button>
                </Box>
              </>
            )}
          </Grid>
        </Grid>
      </Container>
      <Dialog open={showLoginDialog} onClose={() => setShowLoginDialog(false)}>
        <DialogTitle>로그인</DialogTitle>
        <DialogContent>
          <LoginForm onLogin={handleLoginSuccess} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLoginDialog(false)} color="primary">닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BoardList;
