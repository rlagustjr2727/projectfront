import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MyPageService from '../../api/MyPageService';
import './MyBoards.css';

const MyBoards = () => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await MyPageService.getBoardsByAuthor();
        setBoards(response.data);
      } catch (error) {
        console.error('Error fetching boards:', error);
      }
    };

    fetchBoards();
  }, []);

  return (
    <div className="myboards-container">
      <div className='myboards-container-title' style={{fontSize:'1.0em', fontWeight:'600'}}>My Boards</div>
      {boards.length > 0 ? (
        <div className="myboards-card-container">
          {boards.map((board) => (
            <Link to={`/board/detail/${board.boardSeq}`} key={board.boardSeq} className="myboards-card-link">
              <div className="myboards-card">
                <div className="myboards-card-header">My Board</div>
                <div className="myboards-card-body">
                  {/* <p><strong>Author:</strong> {board.boardAuthor}</p> */}
                  <p className='myboard-card-title'>Title:<span className="truncated-title">{board.boardTitle}</span></p>
                  <p className='myboard-card-title'>Category: {board.boardCategory}</p>
                  <p className='myboard-card-title'>Date: {new Date(board.boardDate).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="no-boards-message">No boards found.</p>
      )}
    </div>
  );
};

export default MyBoards;
