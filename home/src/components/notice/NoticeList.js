import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NoticeService from '../../api/NoticeService';
import './NoticeList.css';
import LoginForm from '../login/LoginForm';
import noticeImageIcon from '../../assets/image/boardImage.jpg'; // 이미지 아이콘 경로 설정

const NoticeList = () => {
  const [notices, setNotices] = useState([]); // 빈 배열로 초기화
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const pageSize = 5;
  const navigate = useNavigate();

  const fetchNotices = useCallback(() => {
    setLoading(true);
    NoticeService.getAllNotices(page - 1, pageSize).then((response) => {
      setNotices(response.content || []); // 데이터가 없으면 빈 배열을 할당
      setTotalPages(response.totalPages);
      setLoading(false);
    }).catch((error) => {
      console.error('공지사항 데이터를 불러오는 중 에러 발생!', error);
      setLoading(false);
    });
  }, [page, pageSize]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCreate = async () => {
    // 로그인이 되어있는지 체크
    const response = {}; // 로그인 체크 부분을 구현해야 합니다.
    if (response) {
      setIsLoggedIn(true);
      navigate('/notice/write');
    } else {
      alert('로그인이 필요합니다.');
      setShowLoginDialog(true);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={`page-${i}`}
          className={`pagination-button ${i === page ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginDialog(false);
  };

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices, page]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date)) {
      return date.toLocaleDateString();
    }
    return 'Invalid Date';
  };


  return (
    <div className="notice-list-container">
      <div className="notice-main-content">
        <div className="notice-title">공지사항</div>
        <div className="table-header">
          <div className="table-header-item table-cell-small">번호</div>
          <div className="table-header-item table-cell-large">제목</div>
          <div className="table-header-item table-cell-medium">작성자</div>
          <div className="table-header-item table-cell-medium">작성일</div>
          <div className="table-header-item table-cell-small">조회수</div>
        </div>
        {loading ? (
          <div className="loading-box">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="notice-table-container">
            {notices && notices.map((notice, index) => (
              <div key={notice.noticeSeq || index} className="table-row">
                <div className="table-cell table-cell-small">{(page - 1) * pageSize + index + 1}</div>
                <div className="table-cell table-cell-large">
                  <Link to={`/notice/detail/${notice.noticeSeq}`} className="notice-link">
                    <div className="notice-title-container">
                      [{notice.noticeCategory}] {notice.noticeTitle}
                      {notice.noticeContentImage && (
                        <div className="icon image-box-light-icon" />
                      )}
                    </div>
                  </Link>
                </div>
                <div className="table-cell table-cell-medium">{notice.adminId}</div>
                <div className="table-cell table-cell-medium">{formatDate(notice.noticeDateTime)}</div>
                <div className="table-cell table-cell-small">{notice.noticeViewCount}</div>
              </div>
            ))}
          </div>
        )}
        <div className="pagination-create-container">
          <div className="pagination-container">
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="picon expand-left-icon" />
            {renderPageNumbers()}
            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="picon expand-right-icon" />
          </div>
          <div className="notice-create-button-container">
            <button onClick={handleCreate} className="notice-create-button">
              공지사항 작성
            </button>
          </div>
        </div>
      </div>
      {showLoginDialog && (
        <div className="login-dialog">
          <div className="login-dialog-content">
            <h2>로그인</h2>
            <LoginForm onLogin={handleLoginSuccess} />
            <button onClick={() => setShowLoginDialog(false)} className="close-button">닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeList;
