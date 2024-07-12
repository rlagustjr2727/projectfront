import React from 'react';
import './Sidebar.css';

const Sidebar = ({ onSelect }) => {
    return (
        <div className="sidebar">
            <ul>
                <li onClick={() => onSelect('editProfile')}>회원 정보 수정</li>
                <li onClick={() => onSelect('myBoards')}>게시글 목록</li>
                <li onClick={() => onSelect('myComments')}>내가 쓴 댓글</li>
                <li onClick={() => onSelect('likedBoards')}>내가 좋아요한 게시글</li>
            </ul>
        </div>
    );
};

export default Sidebar;
