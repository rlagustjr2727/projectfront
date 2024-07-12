// LikedBoards.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LikedBoards = ({ userId }) => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    axios.get(`/api/liked-boards/${userId}`)
      .then(response => setBoards(response.data))
      .catch(error => console.error('Error fetching liked boards:', error));
  }, [userId]);

  return (
    <div className="liked-boards">
      <h2>내가 좋아요한 게시글</h2>
      <ul>
        {boards.map(board => (
          <li key={board.id}>{board.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default LikedBoards;
