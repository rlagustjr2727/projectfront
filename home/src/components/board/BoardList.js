import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import BoardService from '../../api/BoardService';
import UserService from '../../api/UserService';
import './BoardList.css';
import LoginForm from '../login/LoginForm';

const BoardList = () => {
  const { category } = useParams();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [searchOption, setSearchOption] = useState('title');
  const [sortOption, setSortOption] = useState('recent');
  const [selectedCategory, setSelectedCategory] = useState(category || '전체 게시판');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pageSize = 5;
  const navigate = useNavigate();
  const location = useLocation();

  const fetchBoards = useCallback(() => {
    setLoading(true);
    BoardService.getBoards(page - 1, pageSize, sortOption).then((response) => {
      setBoards(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    }).catch((error) => {
      console.error('게시글 데이터를 불러오는 중 에러 발생!', error);
      setLoading(false);
    });
  }, [page, sortOption]);

  const fetchBoardsByCategory = useCallback((category) => {
    setLoading(true);
    BoardService.getBoardsByCategory(category, page - 1, pageSize, sortOption).then((response) => {
      setBoards(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    }).catch((error) => {
      console.error('카테고리별 게시글 데이터를 불러오는 중 에러 발생!', error);
      setLoading(false);
    });
  }, [page, sortOption]);

  const handleSearch = useCallback(() => {
    setLoading(true);
    if (searchOption === 'title') {
      BoardService.searchBoardsByTitle(keyword, page - 1, pageSize).then((response) => {
        setBoards(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      }).catch((error) => {
        console.error('검색 중 에러 발생!', error);
        setLoading(false);
      });
    } else {
      BoardService.searchBoardsByTitleAndContent(keyword, page - 1, pageSize).then((response) => {
        setBoards(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      }).catch((error) => {
        console.error('검색 중 에러 발생!', error);
        setLoading(false);
      });
    }
  }, [keyword, page, pageSize, searchOption]);

  const onSearchWordKeyDownHandler = (event) => {
    if (event.key !== 'Enter') return;
    handleSearch();
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setPage(1);
    navigate(`/board/${category}`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCreate = async () => {
    try {
      const response = await UserService.getCurrentUser();
      console.log('User data:', response.data);
      setIsLoggedIn(true);
      navigate('/board/write');
    } catch (error) {
      console.error('Error fetching user data', error);
      navigate('/login');
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`pagination-button ${i === page ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const getCategoryAbbreviation = (category) => {
    switch (category) {
      case '자유 게시판':
        return '자유';
      case '나눔 게시판':
        return '나눔';
      case '장터 게시판':
        return '장터';
      case '정보 게시판':
        return '정보';
      default:
        return category;
    }
  };

  useEffect(() => {
    if (selectedCategory === '전체 게시판' || !selectedCategory) {
      fetchBoards();
    } else {
      fetchBoardsByCategory(selectedCategory);
    }
  }, [fetchBoards, fetchBoardsByCategory, selectedCategory, page]);

  useEffect(() => {
    if (location.state && location.state.newBoard) {
      setPage(1);
    }
  }, [location]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setPage(1);
  };

  return (
    <div className="board-list-container">
      <div className="board-list">
        <div className="category-container">
          <div className="categoty-main-title">게시판 목록</div>
          <ul>
            {['전체 게시판', '자유 게시판', '나눔 게시판', '장터 게시판', '정보 게시판'].map((text) => (
              <li key={text} onClick={() => handleCategorySelect(text)} className="category-item">
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="board-main-content">
        <h2 className="board-title">{selectedCategory}</h2>
        <div className="search-sort-container">
          <div className="sort-container">
            <select value={sortOption} onChange={handleSortChange} className="sort-option">
              <option value="recent">최신 등록순</option>
              <option value="views">조회수 많은순</option>
            </select>
          </div>
          <div className="search-container">
            <div className="search-options">
              <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)} className="search-option">
                <option value="title">제목</option>
                <option value="title+content">제목+내용</option>
              </select>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={onSearchWordKeyDownHandler}
                className="board-search-input"
                placeholder="검색어를 입력하세요"
              />
              <button onClick={handleSearch} className="search-button">검색</button>
            </div>
          </div>
        </div>
        <div className="table-header">
          <div className={`table-header-item ${selectedCategory === '전체 게시판' ? '' : 'table-cell-small'}`}>{selectedCategory === '전체 게시판' ? '' : '번호'}</div>
          <div className="table-header-item table-cell-large">제목</div>
          <div className="table-header-item table-cell-medium">작성자</div> 
          <div className="table-header-item table-cell-medium">작성일</div>
          <div className="table-header-item table-cell-small">조회수</div>
        </div>
        {loading ? (
          <div className="loading-box">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="board-table-container">
            {boards.map((board, index) => (
              <div key={board.boardSeq} className="table-row">
                {selectedCategory !== '전체 게시판' && (
                  <div className="table-cell table-cell-small">{(page - 1) * pageSize + index + 1}</div>
                )}
                <div className="table-cell table-cell-large">
                  <Link to={`/board/detail/${board.boardSeq}`} className="board-link">
                    <div className="board-title-container">
                      [{getCategoryAbbreviation(board.boardCategory)}] {board.boardTitle}
                      {board.boardImage && (
                        <div className="icon image-box-light-icon" /> // 이미지가 있을 때 아이콘 표시
                      )}
                      {board.commentCount > 0 && (
                        <span className="comment-count">
                          ({board.commentCount})
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
                <div className="table-cell table-cell-medium">{board.boardAuthor}</div>
                <div className="table-cell table-cell-medium">{new Date(board.boardDate).toLocaleDateString()}</div>
                <div className="table-cell table-cell-small">{board.boardViews}</div>
              </div>
            ))}
          </div>
        )}
        <div className="pagination-create-container">
          <div className="pagination-container">
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="picon expand-left-icon" />
            {renderPageNumbers()}
            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="picon expand-right-icon" />
          </div>
          <div className="create-button-container">
            <button onClick={handleCreate} className="create-button">
              게시글 작성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardList;
