// MyBoards.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyBoards = ({ userId }) => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    axios.get(`/api/my-boards/${userId}`)
      .then(response => setBoards(response.data))
      .catch(error => console.error('Error fetching my boards:', error));
  }, [userId]);

  return (
    <div className="my-boards">
      <h2>내가 작성한 게시글</h2>
      <ul>
        {boards.map(board => (
          <li key={board.id}>{board.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyBoards;
