// Modal.js
import React from 'react';
import './Modal.css';

const Modal = ({ image, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <img src={image} alt="Modal" />
      </div>
    </div>
  );
};

export default Modal;
