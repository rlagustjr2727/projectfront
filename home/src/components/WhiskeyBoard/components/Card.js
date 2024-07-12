//Card.js
import React, { useState } from "react";
import "./Card.css"; // CSS 파일 불러오기

const Card = ({ whiskey_img, whiskey_name, whiskey_info, whiskey_type, whiskey_origin, whiskey_alcohol, whiskey_tip, whiskey_age, whiskey_alcohol_type, onDelete, onUpdate }) => {
  const [showTip, setShowTip] = useState(false);

  const handleMouseEnter = () => {
    if (whiskey_tip) {
      setShowTip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTip(false);
  };

  const handleDelete = () => {
    onDelete(whiskey_name, whiskey_img);
  };

  const handleUpdate = () => {
    onUpdate({
      whiskey_name,
      whiskey_info,
      whiskey_tip,
      whiskey_type,
      whiskey_origin,
      whiskey_alcohol,
      whiskey_age,
      whiskey_alcohol_type,
      whiskey_img
    });
  };

  return (
    <div className="card">
      <div className="thumb">
        <img src={whiskey_img} alt={whiskey_name} />
      </div>
      <div className="content">
        <div className="burger" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <svg xmlns="http://www.w3.org/2000/svg"
           width="25" 
           height="25" 
           fill="currentColor" 
           className="bi bi-list" 
           viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
          </svg>
          { showTip && whiskey_name &&(
            <div className="menu">
              <button className="delete-button" onClick={handleDelete}>삭제</button>
              <button className="update-button" onClick={handleUpdate}>수정</button>
            </div>
          )}
        </div>
        <p className="some">{whiskey_info}</p>
      </div>
      <div className="detial">
        <div className="title">
          <p className="name">{whiskey_name}</p>
          <div className="action" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chat-right-text"
              viewBox="0 0 16 16"
              style={{ cursor: 'pointer' }}
            >
              <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z"/>
              <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
            </svg>
            {showTip && whiskey_tip && <p className="tooltip">{whiskey_tip}</p>}
          </div>
        </div>
        <div className="infomation">
          <p className="propertion">{whiskey_type}</p>
          <p className="propertion">{whiskey_origin}</p>
          <p className="propertion">{whiskey_alcohol}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
