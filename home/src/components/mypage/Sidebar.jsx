import React from 'react';
import './Sidebar.css';

const Sidebar = ({ setCurrentPage }) => {
  return (
    <div className="sidebar-container">
      <ul>
        <li onClick={() => setCurrentPage('editprofile')}>회원정보 수정</li>
        <li onClick={() => setCurrentPage('myboards')}>작성 글</li>
        <li onClick={() => setCurrentPage('mycomments')}>작성 댓글</li>
        <li onClick={() => setCurrentPage('likedboards')}>좋아요 한 게시글</li>
      </ul>
    </div>
  );
};

export default Sidebar;