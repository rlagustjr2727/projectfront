import React, { useState, useEffect } from 'react';
import MyPageService from '../../api/MyPageService';
import './LikedBoards.css';

const LikedBoards = () => {
  const [likedBoards, setLikedBoards] = useState([]);

  useEffect(() => {
    const fetchLikedBoards = async () => {
      try {
        const response = await MyPageService.getLikedBoards();
        setLikedBoards(response.data);
      } catch (error) {
        console.error('Error fetching liked boards:', error);
      }
    };

    fetchLikedBoards();
  }, []);

  return (
    <div className="likedboards-container">
      {/* <div className="likedboards-header">Liked Boards</div> */}
      {likedBoards.length > 0 ? (
        <div className="likedboards-card-container">
          {likedBoards.map((board) => (
            <div key={board.boardSeq} className="likedboards-card">
              <div className="likedboards-card-header">Like</div>
              <div className="likedboards-card-body">
                <p><strong>Author:</strong> {board.boardAuthor}</p>
                <p><strong>Title:</strong> {board.boardTitle}</p>
                <p><strong>Category:</strong> {board.boardCategory}</p>
                <p><strong>Date:</strong> {new Date(board.boardDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-likedboards-message">No liked boards found.</p>
      )}
    </div>
  );
};

export default LikedBoards;
