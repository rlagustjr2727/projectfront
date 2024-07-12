import React from 'react';

const SearchInput = ({ value, onChange, onClick, onFocus, placeholder }) => {
    return (
        <div className="search-input">
            <input
                type="text"
                value={value}
                onChange={onChange}
                onClick={onClick}
                onFocus={onFocus} // 검색창이 포커스될 때 처리
                placeholder={placeholder}
            />
            <button onClick={onClick}>검색</button>
        </div>
    );
};

export default SearchInput;
