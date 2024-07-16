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
import CommentIcon from '@mui/icons-material/Comment';
import './BoardDetail.css';
import DEFAULT_PROFILE_IMAGE from '../../assets/image/default-profile-image.png';

const BoardDetail = () => {
  const { category } = useParams();
  const { seq } = useParams();
  const [page, setPage] = useState(1);
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(category || '전체 게시판');
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
        const response = await axios.get('http://localhost:8080/api/me', { withCredentials: true });
        console.log('Fetched user:', response.data);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data', error);
        setUser(null);
      }
    };

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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setPage(1);
    navigate(`/board/${category}`);
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
    return <div className="detail-loading-box"><CircularProgress /></div>;
  }

  if (!board) {
    return <div className="detail-loading-box"><Typography>게시글을 불러오지 못했습니다.</Typography></div>;
  }

  const currentUserNickname = user?.userNickName;

  return (
    <div>
      <div className="detail-container">
        <div className="detail-board-list">
          <div className="detail-category-container">
            <div className="detail-categoty-main-title">게시판 목록</div>
            <ul>
              {['전체 게시판', '자유 게시판', '나눔 게시판', '장터 게시판', '정보 게시판'].map((text) => (
                <li key={text} onClick={() => handleCategorySelect(text)} className="detail-category-item">
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="detail-content">
          <div className="detail-board-detail-container">
          <div className="detail-header">
            <div className="detail-header-left">
              <Typography variant="h6" color="textSecondary" style={{ fontSize: '0.8em', color: '#778c86', fontWeight: '600', marginBottom: '5px' }}>{board.boardCategory}</Typography>
              <Typography variant="h4" gutterBottom style={{ fontSize: '2em', fontWeight: '600' }}>{board.boardTitle}</Typography>
            </div>
            <div className="detail-header-right">
              <CommentIcon />
              <Typography>{comments.length}</Typography>
            </div>
          </div>
          <div className="detail-author">
            <Avatar alt={board.boardAuthor} src={board.boardProfileImage || DEFAULT_PROFILE_IMAGE} className="detail-author-avatar" />
            <div className="detail-author-info">
              <Typography className="detail-author-name" style={{ fontSize: '0.8em', fontWeight: '500' }}>{board.boardAuthor}</Typography>
              <Typography className="detail-author-date">{`Date: ${new Date(board.boardDate).toLocaleDateString()} | Views: ${board.boardViews}`}</Typography>
            </div>
          </div>
            {board.boardImage && (
              <img src={`http://localhost:8080/${board.boardImage}`} alt={board.boardTitle} className="detail-board-detail-image" />
            )}
            <Typography className="detail-body" style={{ fontSize: '1.0em'}}>{board.boardContent}</Typography>
            <Box display="flex" alignItems="center">
              <IconButton onClick={handleLikeClick} aria-label="like">
                {liked ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
              </IconButton> 
              <Typography variant="body2" color="textSecondary" style={{ marginLeft: '8px', fontSize: '0.7em' }}>{likes}</Typography>
              {board.boardAuthor === currentUserNickname && (
                <>
                  <Button onClick={openEditDialog} startIcon={<EditIcon />}>수정</Button>
                  <Button onClick={handleDeleteBoard} startIcon={<DeleteIcon />} color="secondary">삭제</Button>
                </>
              )}
            </Box>
          </div>
  
          <div className="detail-comments-container">
            <Typography variant="h5" gutterBottom style={{ fontSize: '0.75em' }}>댓글</Typography>
            {comments.map(comment => (
              <Box key={comment.commentSeq} className="detail-comment" display="flex" alignItems="center">
                <Avatar alt={comment.commentAuthor} src={comment.commentProfileImage || DEFAULT_PROFILE_IMAGE} />
                <Box ml={2} flexGrow={1}>
                  <Typography variant="body2" color="textSecondary" style={{ fontSize: '0.45em' }}>{comment.commentAuthor}</Typography>
                  <Typography variant="body1" style={{ fontSize: '0.6em' }}>{comment.commentContent}</Typography>
                  <Typography variant="body2" color="textSecondary" style={{ fontSize: '0.35em' }}>{new Date(comment.commentDate).toLocaleString()}</Typography>
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
            <form onSubmit={handleCommentSubmit} className="detail-comment-form">
              <TextField
                label="댓글 작성"
                variant="outlined"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                fullWidth
                multiline
                rows={4}
                style={{ fontSize: '1.0em' }}
              />
              <Button type="submit" variant="contained" color="primary" style={{fontSize: '0.35em'}}>댓글 등록</Button>
            </form>
          </div>
        </div>
      </div>
  
      <Box className="detail-actions-container" display="flex" justifyContent="flex-end" mt={2}>
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
                style={{ fontSize: '0.8em' }}
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
                style={{ fontSize: '0.6em' }}
              />
            </Box>
            <Box my={2}>
              <FormControl fullWidth>
                <InputLabel style={{ fontSize: '1.2em' }}>카테고리</InputLabel>
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
                style={{ fontSize: '0.6em' }}
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
