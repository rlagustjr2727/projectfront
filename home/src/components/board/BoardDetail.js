import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import BoardService from '../../api/BoardService';
import CommentService from '../../api/CommentService';
import { Typography, Button, Box, CircularProgress, TextField, IconButton, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import './BoardDetail.css';
import DEFAULT_PROFILE_IMAGE from '../../assets/image/default-profile-image.png';

const BoardDetail = () => {
  const { seq } = useParams();
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedBoard, setEditedBoard] = useState({
    boardTitle: '',
    boardContent: '',
    boardCategory: '',
    boardImage: null,
  });
  const navigate = useNavigate();
  const location = useLocation();

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");

  const fetchBoard = useCallback(async () => {
    if (!seq) {
      console.error('Board ID is not provided!');
      setLoading(false);
      return;
    }

    try {
      const response = await BoardService.getBoardBySeq(seq);
      setBoard(response.data);
      setLikes(response.data.boardLikes || 0);
      setLiked(response.data.liked);
      setLoading(false);
      await BoardService.incrementViews(seq);
    } catch (error) {
      console.error('Error fetching the board data!', error);
      setLoading(false);
    }
  }, [seq]);

  const fetchComments = useCallback(async () => {
    if (!seq) {
      console.error('Board ID is not provided!');
      return;
    }

    try {
      const response = await CommentService.getCommentsByBoardSeq(seq);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments!', error);
    }
  }, [seq]);

  useEffect(() => {
    fetchBoard();
    fetchComments();
  }, [fetchBoard, fetchComments]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
<<<<<<< HEAD
        const response = await axios.get('http://localhost:8080/api/me', { withCredentials: true });
        console.log('Fetched user:', response.data);
=======
<<<<<<< HEAD
        const response = await axios.get('/api/auth/user');
=======
        const response = await axios.get('/api/auth/me'); // 세션 기반으로 사용자 정보를 가져옴
>>>>>>> dc75dd2fcc590180fd3778bfeefd1c480aa81214
        console.log('User data:', response.data);
>>>>>>> origin/main
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data', error);
        setUser(null);
      }
    };

<<<<<<< HEAD
    fetchUser();
  }, []);

  const handleLogout = () => {
    axios.post('http://localhost:8080/api/logout', {}, { withCredentials: true })
      .then(() => {
        setUser(null);
        alert('로그아웃 되었습니다.');
        navigate('/login');
      })
      .catch(error => {
        console.error('Error during logout', error);
=======
<<<<<<< HEAD
    fetchUser();
=======
    fetchUser(); // 세션 사용이므로 토큰 체크 없이 바로 요청
>>>>>>> dc75dd2fcc590180fd3778bfeefd1c480aa81214
  }, []);

  const handleLogout = () => {
    axios.post('/api/logout')
      .then(() => {
        setUser(null);
        alert('로그아웃 되었습니다.');
        navigate('/login'); // 로그아웃 후 로그인 페이지로 리다이렉트
      })
      .catch(error => {
        console.error('Error logging out!', error);
>>>>>>> origin/main
      });
  };

  const handleDeleteBoard = () => {
    if (!seq) {
      console.error('Board ID is not provided!');
      return;
    }

    BoardService.deleteBoard(seq)
      .then(() => {
        navigate('/board', { state: { category: location.state?.category } });
      })
      .catch(error => {
        console.error('Error deleting board!', error);
      });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!seq) {
      console.error('Board ID is not provided!');
      return;
    }

    const commentAuthor = user.userNickName;
    const commentAuthorImage = user.userProfileImage || DEFAULT_PROFILE_IMAGE;

    const comment = {
      commentContent: newComment,
      commentAuthor,
      commentAuthorImage,
      board: { boardSeq: seq },
    };

    CommentService.createComment(comment, { withCredentials: true })
      .then(response => {
        setComments([...comments, response.data]);
        setNewComment("");
      })
      .catch(error => {
        console.error('Error creating comment!', error);
      });
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.commentSeq);
    setEditingCommentContent(comment.commentContent);
  };

  const handleUpdateComment = (e) => {
    e.preventDefault();
    if (!editingCommentId) {
      console.error('Comment ID is not provided!');
      return;
    }

    CommentService.updateComment(editingCommentId, { commentContent: editingCommentContent }, { withCredentials: true })
      .then(response => {
        setComments(comments.map(comment => comment.commentSeq === editingCommentId ? response.data : comment));
        setEditingCommentId(null);
        setEditingCommentContent("");
      })
      .catch(error => {
        console.error('Error updating comment!', error);
      });
  };

  const handleDeleteComment = (id) => {
    if (!id) {
      console.error('Comment ID is not provided!');
      return;
    }

    CommentService.deleteComment(id, { withCredentials: true })
      .then(() => {
        setComments(comments.filter(comment => comment.commentSeq !== id));
      })
      .catch(error => {
        console.error('Error deleting comment!', error);
      });
  };

  const handleLikeClick = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (liked) {
      BoardService.unlikeBoard(seq, { withCredentials: true })
        .then(() => {
          setLiked(false);
          setLikes(likes - 1);
        })
        .catch(error => {
          console.error('좋아요 취소 중 에러 발생!', error);
        });
    } else {
      BoardService.likeBoard(seq, { withCredentials: true })
        .then(() => {
          setLiked(true);
          setLikes(likes + 1);
        })
        .catch(error => {
          console.error('좋아요 처리 중 에러 발생!', error);
        });
    }
  };

  const openEditDialog = () => {
    setEditedBoard({
      boardTitle: board.boardTitle,
      boardContent: board.boardContent,
      boardCategory: board.boardCategory,
      boardImage: null,
    });
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditChange = (e) => {
    setEditedBoard({ ...editedBoard, [e.target.name]: e.target.value });
  };

  const handleEditImageChange = (e) => {
    setEditedBoard({ ...editedBoard, boardImage: e.target.files[0] });
  };

const handleEditSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('board', new Blob([JSON.stringify({
        boardTitle: editedBoard.boardTitle,
        boardContent: editedBoard.boardContent,
        boardCategory: editedBoard.boardCategory
    })], { type: 'application/json' }));
    if (editedBoard.boardImage, { withCredentials: true }) {
        formData.append('image', editedBoard.boardImage);
    }

    BoardService.updateBoard(seq, formData)
        .then(() => {
            fetchBoard();
            closeEditDialog();
        })
        .catch(error => {
            console.error('Error updating board!', error);
        });
};


  if (loading) {
    return <div className="loading-box"><CircularProgress /></div>;
  }

  if (!board) {
    return <div className="loading-box"><Typography>게시글을 불러오지 못했습니다.</Typography></div>;
  }

  const currentUserNickname = user?.userNickName;

  return (
    <div className="container">
      <div className="board-detail-container">
        <Typography variant="h6" color="textSecondary">
          <Avatar alt={board.boardAuthor} src={board.boardProfileImage || DEFAULT_PROFILE_IMAGE} style={{ marginRight: '8px' }} />
          {board.boardCategory}
        </Typography>
        <Typography variant="h4" gutterBottom>{board.boardTitle}</Typography>
        {board.boardImage && (
          <img src={`http://localhost:8080/${board.boardImage}`} alt={board.boardTitle} className="board-detail-image" />
        )}
        <Typography variant="body1" gutterBottom>{board.boardContent}</Typography>
        <Typography variant="body2" color="textSecondary">{`Author: ${board.boardAuthor} | Date: ${new Date(board.boardDate).toLocaleDateString()} | Views: ${board.boardViews}`}</Typography>
        <Box display="flex" alignItems="center">
          <IconButton onClick={handleLikeClick} aria-label="like">
            {liked ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body2" color="textSecondary" style={{ marginLeft: '8px' }}>{likes}</Typography>
          {board.boardAuthor === currentUserNickname && (
            <>
              <Button onClick={openEditDialog} startIcon={<EditIcon />}>수정</Button>
              <Button onClick={handleDeleteBoard} startIcon={<DeleteIcon />} color="secondary">삭제</Button>
            </>
          )}
        </Box>
      </div>

      <div className="comments-container">
        <Typography variant="h5" gutterBottom>댓글</Typography>
        {comments.map(comment => (
          <Box key={comment.commentSeq} className="comment" display="flex" alignItems="center">
            <Avatar alt={comment.commentAuthor} src={comment.commentProfileImage || DEFAULT_PROFILE_IMAGE} />
            <Box ml={2} flexGrow={1}>
              <Typography variant="body2" color="textSecondary">{comment.commentAuthor}</Typography>
              <Typography variant="body1">{comment.commentContent}</Typography>
              <Typography variant="body2" color="textSecondary">{new Date(comment.commentDate).toLocaleString()}</Typography>
              {comment.commentAuthor === currentUserNickname && (
                <>
                  <IconButton onClick={() => handleEditComment(comment)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteComment(comment.commentSeq)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
        ))}
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <TextField
            label="New Comment"
            variant="outlined"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
          <Button type="submit" variant="contained" color="primary">Submit</Button>
        </form>
      </div>
      <Box display="flex" justifyContent="flex-start" mt={2}>
        <Button variant="contained" color="primary" component={Link} to="/board" state={{ category: location.state?.category }} style={{ marginRight: '10px' }}>
          글 목록
        </Button>
      </Box>

      <Dialog open={isEditDialogOpen} onClose={closeEditDialog}>
        <DialogTitle>게시글 수정</DialogTitle>
        <DialogContent>
          <form onSubmit={handleEditSubmit} encType="multipart/form-data">
            <Box my={2}>
              <TextField
                label="제목"
                name="boardTitle"
                value={editedBoard.boardTitle}
                onChange={handleEditChange}
                fullWidth
                required
              />
            </Box>
            <Box my={2}>
              <TextField
                label="내용"
                name="boardContent"
                value={editedBoard.boardContent}
                onChange={handleEditChange}
                fullWidth
                required
                multiline
                rows={4}
              />
            </Box>
            <Box my={2}>
              <FormControl fullWidth>
                <InputLabel>카테고리</InputLabel>
                <Select
                  label="카테고리"
                  name="boardCategory"
                  value={editedBoard.boardCategory}
                  onChange={handleEditChange}
                  required
                >
                  <MenuItem value="장터 게시판">장터 게시판</MenuItem>
                  <MenuItem value="정보 게시판">정보 게시판</MenuItem>
                  <MenuItem value="나눔 게시판">나눔 게시판</MenuItem>
                  <MenuItem value="자유 게시판">자유 게시판</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box my={2}>
              <input
                type="file"
                name="boardImage"
                onChange={handleEditImageChange}
              />
            </Box>
            <DialogActions>
              <Button onClick={closeEditDialog} color="primary">취소</Button>
              <Button type="submit" variant="contained" color="primary">수정</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoardDetail;
