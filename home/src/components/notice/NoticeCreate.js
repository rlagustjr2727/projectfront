import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../api/UserService';
import NoticeService from '../../api/NoticeService';
import './NoticeCreate.css';

const NoticeCreate = () => {
  const [notice, setNotice] = useState({
    title: '',
    category: '',
    content: '',
  });
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UserService.getCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data', error);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    setNotice({ ...notice, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const noticeData = {
      noticeTitle: notice.title,
      noticeCategory: notice.category,
      noticeContent: notice.content,
      adminId: user.userNickName || 'Anonymous'
    };

    try {
      await NoticeService.createNotice(noticeData, image);
      navigate('/notice', { state: { newNotice: true } });
    } catch (error) {
      console.error('Error creating the notice!', error);
    }
  };

  return (
    <div className="notice-create-container">
      <div className="notice-form-container" elevation={3}>
        <div className='notice-create-form-title'>공지사항 작성</div>
        <form onSubmit={handleCreate} encType="multipart/form-data">
          <div className="form-group" my={2}>
            <label htmlFor="category">카테고리</label>
            <select
              name="category"
              value={notice.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>카테고리를 선택하세요</option>
              <option value="필독">필독</option>
              <option value="공지">공지</option>
            </select>
          </div>
          <div className="form-group" my={2}>
            <label htmlFor="title">제목</label>
            <input
              type="text"
              name="title"
              value={notice.title}
              onChange={handleChange}
              placeholder='제목 입력'
              required
            />
          </div>
          <div className="form-group" my={2}>
            <label htmlFor="content">내용</label>
            <textarea
              name="content"
              value={notice.content}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>
          <div className="form-group" my={2}>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
            />
          </div>
          <div className="form-group" my={2} style={{ display: 'flex', justifyContent: 'right' }}>
            <button className='submit-button' type="submit" style={{ width: '100px' }}>작성하기</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeCreate;
