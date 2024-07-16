import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NoticeService from '../../api/NoticeService';
import { Typography, Button, Box, CircularProgress, TextField, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './NoticeDetail.css';
import DEFAULT_PROFILE_IMAGE from '../../assets/image/default-profile-image.png';

const NoticeDetail = () => {
  const { seq } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedNotice, setEditedNotice] = useState({
    noticeTitle: '',
    noticeContent: '',
    noticeCategory: '',
    noticeContentImage: null,
  });
  const navigate = useNavigate();

  const fetchNotice = useCallback(async () => {
    if (!seq) {
      console.error('Notice ID is not provided!');
      setLoading(false);
      return;
    }

    try {
      const response = await NoticeService.getNoticeBySeq(seq);
      setNotice(response.data);
      await NoticeService.incrementViews(seq); // 조회수 증가 요청
      setLoading(false);
    } catch (error) {
      console.error('Error fetching the notice data!', error);
      setLoading(false);
    }
  }, [seq]);

  useEffect(() => {
    fetchNotice();
  }, [fetchNotice]);

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

  const handleDeleteNotice = () => {
    if (!seq) {
      console.error('Notice ID is not provided!');
      return;
    }

    NoticeService.deleteNotice(seq)
      .then(() => {
        navigate('/notice');
      })
      .catch(error => {
        console.error('Error deleting notice!', error);
      });
  };

  const openEditDialog = () => {
    setEditedNotice({
      noticeTitle: notice.noticeTitle,
      noticeContent: notice.noticeContent,
      noticeCategory: notice.noticeCategory,
      noticeContentImage: null,
    });
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditChange = (e) => {
    setEditedNotice({ ...editedNotice, [e.target.name]: e.target.value });
  };

  const handleEditImageChange = (e) => {
    setEditedNotice({ ...editedNotice, noticeContentImage: e.target.files[0] });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const noticeData = {
        noticeTitle: editedNotice.noticeTitle,
        noticeContent: editedNotice.noticeContent,
        noticeCategory: editedNotice.noticeCategory
    };

    const formData = new FormData();
    formData.append('notice', new Blob([JSON.stringify(noticeData)], { type: 'application/json' }));
    if (editedNotice.noticeContentImage) {
        formData.append('image', editedNotice.noticeContentImage);
    }

    try {
        const response = await NoticeService.updateNotice(seq, formData);
        console.log('Updated notice data fetched: ', response.data);
        alert('수정 완료');
        fetchNotice();
        closeEditDialog();
    } catch (error) {
        console.error('Error updating notice!', error);
    }
};


  if (loading) {
    return <div className="notice-loading-box"><CircularProgress /></div>;
  }

  if (!notice) {
    return <div className="notice-loading-box"><Typography>공지사항을 불러오지 못했습니다.</Typography></div>;
  }

  const currentUserNickname = user?.userNickName;

  return (
    <div>
      <div className="notice-container">
        <div className="notice-content">
          <div className="notice-board-detail-container">
          <div className="notice-header">
            <div className="notice-header-left">
              <Typography variant="h6" color="textSecondary" style={{ fontSize: '0.8em', color: '#778c86', fontWeight: '600', marginBottom: '5px' }}>{notice.noticeCategory}</Typography>
              <Typography variant="h4" gutterBottom style={{ fontSize: '2em', fontWeight: '600' }}>{notice.noticeTitle}</Typography>
            </div>
          </div>
          <div className="notice-author">
            <Avatar alt={notice.adminId} src={DEFAULT_PROFILE_IMAGE} className="notice-author-avatar" />
            <div className="notice-author-info">
              <Typography className="notice-author-name" style={{ fontSize: '0.8em', fontWeight: '500' }}>{notice.adminId}</Typography>
              <Typography className="notice-author-date">{`Date: ${new Date(notice.noticeDateTime).toLocaleDateString()} | Views: ${notice.noticeViewCount}`}</Typography>
            </div>
          </div>
            {notice.noticeContentImage && (
              <img src={`http://localhost:8080/${notice.noticeContentImage}`} alt={notice.noticeTitle} className="notice-board-detail-image" />
            )}
            <Typography className="notice-body">{notice.noticeContent}</Typography>
            <Box display="flex" alignItems="center">
              {notice.adminId === currentUserNickname && (
                <>
                  <Button onClick={openEditDialog} startIcon={<EditIcon />}>수정</Button>
                  <Button onClick={handleDeleteNotice} startIcon={<DeleteIcon />} color="secondary">삭제</Button>
                </>
              )}
            </Box>
          </div>
        </div>
      </div>
  
      <Box display="flex" justifyContent="flex-start" mt={2}>
        <Button variant="contained" color="primary" component={Link} to="/notice" style={{ marginRight: '10px' }}>
          글 목록
        </Button>
      </Box>
  
      <Dialog open={isEditDialogOpen} onClose={closeEditDialog}>
        <DialogTitle>공지사항 수정</DialogTitle>
        <DialogContent>
          <form onSubmit={handleEditSubmit} encType="multipart/form-data">
            <Box my={2}>
              <TextField
                label="제목"
                name="noticeTitle"
                value={editedNotice.noticeTitle}
                onChange={handleEditChange}
                fullWidth
                required
                style={{ fontSize: '0.8em' }}
              />
            </Box>
            <Box my={2}>
              <TextField
                label="내용"
                name="noticeContent"
                value={editedNotice.noticeContent}
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
                  name="noticeCategory"
                  value={editedNotice.noticeCategory}
                  onChange={handleEditChange}
                  required
                >
                  <MenuItem value="공지">공지</MenuItem>
                  <MenuItem value="필독">필독</MenuItem>
                  <MenuItem value="일반">일반</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box my={2}>
              <input
                type="file"
                name="noticeContentImage"
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

export default NoticeDetail;
