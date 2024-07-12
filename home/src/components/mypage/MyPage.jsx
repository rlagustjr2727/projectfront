import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Sidebar 컴포넌트 import
import EditProfile from './EditProfile';
import MyBoards from './MyBoards';
import MyComments from './MyComments';
import LikedBoards from './LikedBoards';
import UserInfo from './UserInfo'; // UserInfo 컴포넌트 import
import './MyPage.css';
import './Sidebar.css';

const MyPage = () => {
    const [selectedSection, setSelectedSection] = useState(null);

    const renderSection = () => {
        switch (selectedSection) {
            case 'editProfile':
                return <EditProfile />;
            case 'myBoards':
                return <MyBoards />;
            case 'myComments':
                return <MyComments />;
            case 'likedBoards':
                return <LikedBoards />;
            default:
                return <UserInfo />;
        }
    };

    return (
        <div className="MyPage">
            <Sidebar onSelect={setSelectedSection} />
            <div className="content">
                {renderSection()}
            </div>
        </div>
    );
};

export default MyPage;
