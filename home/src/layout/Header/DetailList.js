import React from 'react';

const DetailList = ({ list, onItemClick, title }) => {
    return (
        <div className="detail-list">
            <h2 className="list-title">{title}</h2>
            <ul>
                {list.map((item, index) => (
                    <li key={index} onClick={() => onItemClick(item)}>
                        {index + 1}. {item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DetailList;
