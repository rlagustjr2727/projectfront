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
    <div>
      <h2>My Boards</h2>
      {boards.length > 0 ? (
        <div className="myboards-card-container">
          {boards.map((board) => (
            <Link to={`/board/detail/${board.boardSeq}`} key={board.boardSeq} className="myboards-card-link">
              <div className="myboards-card">
                <div className="myboards-card-header">My Board</div>
                <div className="myboards-card-body">
                  <p><strong>Author:</strong> {board.boardAuthor}</p>
                  <p><strong>Title:</strong> {board.boardTitle}</p>
                  <p><strong>Category:</strong> {board.boardCategory}</p>
                  <p><strong>Date:</strong> {new Date(board.boardDate).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No boards found.</p>
      )}
    </div>
  );
};

export default MyBoards;
