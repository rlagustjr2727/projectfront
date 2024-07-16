import React, { useState, useEffect } from 'react';
import MyPageService from '../../api/MyPageService';
import './MyComments.css';

const MyComments = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await MyPageService.getCommentsByAuthor();
        console.log('Fetched comments:', response.data); // 응답 데이터 콘솔 출력
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, []);

  return (
    <div>
      <div className="mycomment-comment-header">My Comments</div>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.commentSeq} className="mycomment-comment-card">
            <div className="mycomment-comment-content">
              <div className="mycomment-comment-row">
                <span>Author:</span> {comment.commentAuthor}
              </div>
              <div className="mycomment-comment-row">
                <span>Comment:</span> {comment.commentContent}
              </div>
              <div className="mycomment-comment-row">
                <span>Date:</span> {new Date(comment.commentDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No comments found.</p>
      )}
    </div>
  );
};

export default MyComments;
