import React from 'react';

const DetailList = ({ list, onItemClick, title, showIndex }) => {
    return (
        <div className="detail-list">
            <h2 className="list-title">{title}</h2>
            <ul>
                {list.map((item, index) => (
                    <li key={index} onClick={() => onItemClick(item)}>
                        {showIndex ? `${index + 1}. ${item}` : item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DetailList;
