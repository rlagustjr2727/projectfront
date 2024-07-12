import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BoardService from '../../api/BoardService';
import './RecentBoard.css';

const RecentBoards = () => {
  const [recentBoards, setRecentBoards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    BoardService.getRecentBoards()
      .then(response => setRecentBoards(response.data))
      .catch(error => console.error('Error fetching recent boards:', error));
  }, []);

  const handleBoardClick = (boardSeq) => {
    navigate(`/board/${boardSeq}`);
  };

  return (
    <div className="recent-boards">
      <h2>최근 게시판</h2>
      <ul>
        {recentBoards.map(board => (
          <li key={board.boardSeq} onClick={() => handleBoardClick(board.boardSeq)}>
            <h3>{board.boardTitle}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentBoards;
