import React, { useState } from 'react';
import './MyPage.css';
import Sidebar from './Sidebar';
import EditProfile from './EditProfile';
import MyBoards from './MyBoards';
import MyComments from './MyComments';
import LikedBoards from './LikedBoards';
import UserInfo from './UserInfo';

const MyPage = () => {
  const [currentPage, setCurrentPage] = useState('userinfo'); // 기본값을 'userinfo'로 설정

  const renderContent = () => {
    switch (currentPage) {
      case 'userinfo':
        return <UserInfo />;
      case 'editprofile':
        return <EditProfile />;
      case 'myboards':
        return <MyBoards />;
      case 'mycomments':
        return <MyComments />;
      case 'likedboards':
        return <LikedBoards />;
      default:
        return <UserInfo />; // 기본값을 'userinfo'로 설정
    }
  };

  return (
    <div className="my-page-container">
      <Sidebar setCurrentPage={setCurrentPage} />
      <div className="my-page-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default MyPage;
