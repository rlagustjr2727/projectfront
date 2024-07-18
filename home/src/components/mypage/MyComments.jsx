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
    <div className="mycomments-container">
      <div className="mycomments-comment-header">My Comments</div>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.commentSeq} className="mycomments-comment-card">
            <div className="mycomments-comment-content">
              <div className="mycomments-comment-row">
                <span>Author:</span> {comment.commentAuthor}
              </div>
              <div className="mycomments-comment-row">
                <span>Comment:</span> {comment.commentContent}
              </div>
              <div className="mycomments-comment-row">
                <span>Date:</span> {new Date(comment.commentDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="no-comments-message">No comments found.</p>
      )}
    </div>
  );
};

export default MyComments;
