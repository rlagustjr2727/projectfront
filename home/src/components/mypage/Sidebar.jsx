import React from 'react';
import './Sidebar.css';

const Sidebar = ({ setCurrentPage }) => {
  return (
    <div className="sidebar-container">
      <ul>
        <li onClick={() => setCurrentPage('editprofile')}>회원정보수정</li>
        <li onClick={() => setCurrentPage('myboards')}>내가 작성한 게시물 목록</li>
        <li onClick={() => setCurrentPage('mycomments')}>내가 작성한 댓글 목록</li>
        <li onClick={() => setCurrentPage('likedboards')}>내가 좋아요한 게시글 목록</li>
      </ul>
    </div>
  );
};

export default Sidebar;
