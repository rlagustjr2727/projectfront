import React from 'react';
import "./Nav.css";

const Nav = ({ query, handleInputChange, openModal }) => {
  return (
    <nav>
      <div className="nav-container">
        <input
          className="search-input"
          type="text"
          onChange={handleInputChange}
          value={query}
          placeholder="Enter your search."
        />
        <button className='write' onClick={openModal}>글쓰기</button>
      </div>
    </nav>
  );
};

export default Nav;
