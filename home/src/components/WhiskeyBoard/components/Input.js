import React from 'react';
import "./Input.css";

const Input = ({ handleChange, value, title, isSelected }) => {
  return (
    <button 
      className={`category-input-button ${isSelected ? 'selected' : ''}`} 
      onClick={() => handleChange(value)}
    >
      {title}
    </button>
  );
};

export default Input;