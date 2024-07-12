// MyComments.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyComments = ({ userId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get(`/api/my-comments/${userId}`)
      .then(response => setComments(response.data))
      .catch(error => console.error('Error fetching my comments:', error));
  }, [userId]);

  return (
    <div className="my-comments">
      <h2>내가 작성한 댓글</h2>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyComments;
