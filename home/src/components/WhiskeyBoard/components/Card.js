import React, { useState } from "react";
import "./Card.css"; // CSS 파일 불러오기

const Card = ({ wboard_img, wboard_name, wboard_info, wboard_type, wboard_origin, wboard_abv, wboard_tip, wboard_yo, wboard_abv_type, onDelete, onUpdate }) => {
  const [showTip, setShowTip] = useState(false);

  const handleMouseEnter = () => {
    if (wboard_tip) {
      setShowTip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTip(false);
  };

  const handleDelete = () => {
    onDelete(wboard_name, wboard_img);
  };

  const handleUpdate = () => {
    onUpdate({
      wboard_name,
      wboard_info,
      wboard_tip,
      wboard_type,
      wboard_origin,
      wboard_abv,
      wboard_yo,
      wboard_abv_type,
      wboard_img
    });
  };

  return (
    <div className="card">
      <div className="card-thumbnail">
        <img src={`http://localhost:8080/uploads/${wboard_img}`} alt={wboard_name} />
      </div>
      <div className="card-content">
        <div className="card-menu" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <svg xmlns="http://www.w3.org/2000/svg"
           width="25" 
           height="25" 
           fill="currentColor" 
           className="bi bi-list" 
           viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
          </svg>
          { showTip && wboard_name &&(
            <div className="card-actions">
              <button className="delete-button" onClick={handleDelete}>삭제</button>
              <button className="update-button" onClick={handleUpdate}>수정</button>
            </div>
          )}
        </div>
        <p className="card-description">{wboard_info}</p>
      </div>
      <div className="card-details">
        <div className="card-title">
          <p className="card-name">{wboard_name}</p>
          <div className="card-tooltip" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
            {showTip && wboard_tip && <p className="tooltip">{wboard_tip}</p>}
          </div>
        </div>
        <div className="card-info">
          <p className="card-proportion">{wboard_type}</p>
          <p className="card-proportion">{wboard_origin}</p>
          <p className="card-proportion">{wboard_abv}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
