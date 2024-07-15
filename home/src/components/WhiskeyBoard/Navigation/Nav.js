import React from 'react';
import "./Nav.css";

const Nav = ({ query, handleInputChange, openModal }) => {
  return (
    <nav>
      <div className="wboard-nav-container">
        <input
          className="wboard-search-input"
          type="text"
          onChange={handleInputChange}
          value={query}
          placeholder="검색어를 입력하세요."
        />
        <div className="wboard-write" onClick={openModal}>
          <div className="icon edit-light-icon" />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
