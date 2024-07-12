import React from 'react';
import './Pagination.css'; // CSS 파일을 import 합니다.

const Pagination = ({ itemsPerPage, totalItems, currentPage, onPageChange }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // 한 번에 5개의 페이지 번호만 표시
  const maxPageNumbersToShow = 5;
  const currentPageGroup = Math.ceil(currentPage / maxPageNumbersToShow);
  const startPage = (currentPageGroup - 1) * maxPageNumbersToShow + 1;
  const endPage = Math.min(startPage + maxPageNumbersToShow - 1, totalPages);

  const visiblePageNumbers = pageNumbers.slice(startPage - 1, endPage);

  return (
    <nav>
      <ul className="pagination">
        {currentPageGroup > 1 && (
          <li className="page-item">
            <a onClick={() => onPageChange(startPage - maxPageNumbersToShow)} className="page-link">
              {"<"}
            </a>
          </li>
        )}
        {visiblePageNumbers.map(number => (
          <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
            <a onClick={() => onPageChange(number)} className="page-link">
              {number}
            </a>
          </li>
        ))}
        {currentPageGroup < Math.ceil(totalPages / maxPageNumbersToShow) && (
          <li className="page-item">
            <a onClick={() => onPageChange(endPage + 1)} className="page-link">
              {">"}
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
