
import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import DetailList from './DetailList';
import { BOARD_PATH, MAIN_PATH } from '../../constant';

const Header = () => {
  const [userInput, setUserInput] = useState('');
  const [trendingList, setTrendingList] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showPopularSearch, setShowPopularSearch] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    setTrendingList(['위스키1', '위스키2', '위스키3', '위스키4', '위스키5']);
    setRecommendations(['맥주1', '맥주2', '맥주3', '맥주4', '맥주5']);

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowPopularSearch(false);
        setIsSearchActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputClick = () => {
    setShowPopularSearch(true);
    setIsSearchActive(true);
  };

  const handleItemClick = (keyword) => {
    navigate(`/search/${keyword}`);
  };

  const handleUserInputChange = (event) => {
    const value = event.target.value;
    setUserInput(value);
    setShowPopularSearch(value === '');
  };

  const handleSearchClick = () => {
    console.log('검색: ', userInput);
    navigate(`/search/${userInput}`);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handleCancelClick = () => {
    setIsSearchActive(false);
    setShowPopularSearch(false);
    setUserInput('');
  };

  const handleMouseEnter = (event) => {
    const innerMenu = event.currentTarget.querySelector('.inner_menu');
    innerMenu.style.display = 'block';
    const hdBg = document.querySelector('.hd_bg');
    if (hdBg) {
      hdBg.style.height = `${innerMenu.scrollHeight}px`;
    }
  };

  const handleMouseLeave = (event) => {
    const innerMenu = event.currentTarget.querySelector('.inner_menu');
    innerMenu.style.display = 'none';
    const hdBg = document.querySelector('.hd_bg');
    if (hdBg) {
      hdBg.style.height = '0';
    }
  };
  const handleCommunityClick = () => {
    navigate('/board');
    setUserInput('');
    setIsSearchActive(false);
    setShowPopularSearch(false);
  };

  const onWhiskeyBoardClickHandler = () => {
    navigate('/WhiskeyBoard');
  };

  const onNoticeClickHandler = () => {
    navigate('/notice')
  }

  return (
    <div id="header">
      <div className='header-container'>
        <div className='header-left-box'>
          <div className='header-icon-box'>
            <div className='icon whisky-icon'></div>
          </div>
        </div>
      </div>
      <ul id="gnb">
        <li className="dept1" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className='main-section' onClick={onWhiskeyBoardClickHandler}>맞춤 추천</div>
          <ul className="inner_menu">
            <li className="dept2"><a onClick={() => navigate('/WhiskeyBoard')}>WhiskeyBoard</a></li>
          </ul>
        </li>
        <li className="dept1" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className='main-section' onClick={handleCommunityClick}>커뮤니티</div>
          <ul className="inner_menu">
            <li className="dept2"><a onClick={() => navigate('/board')}>자유 게시판</a></li>
            <li className="dept2"><a href="#">나눔 게시판</a></li>
            <li className="dept2"><a href="#">장터 게시판</a></li>
            <li className="dept2"><a href="#">정보 게시판</a></li>
          </ul>
        </li>
        <li className="dept1" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className='main-section' onClick={onNoticeClickHandler}>공지사항</div>
          <ul className="inner_menu">
            <li className="dept2"><a onClick={() => navigate('/whisky/events')}>행사정보</a></li>
            <li className="dept2"><a href="#">중요 공지</a></li>
            <li className="dept2"><a href="#">필독 공지</a></li>
          </ul>
        </li>
      </ul>

      <div className='header-container-right'></div>

      <div className={`search-container ${isSearchActive ? 'active' : ''}`} ref={searchRef}>
        <div className="main-search-input">
          <input
            type="text"
            value={userInput}
            onChange={handleUserInputChange}
            onClick={handleInputClick}
            onKeyPress={handleKeyPress}
            placeholder="검색어를 입력하세요"
          />
          <div className='icon-button'>
            <div className='icon search-light-icon' onClick={handleSearchClick}></div>
          </div>
        </div>

        {showPopularSearch && (
          <div className="search-results">
            <div className="detail-list-container">
              <DetailList
                list={trendingList}
                onItemClick={handleItemClick}
                title="인기 검색어"
              />
              <DetailList
                list={recommendations}
                onItemClick={handleItemClick}
                title="추천 검색어"
              />
            </div>
          </div>
        )}
      </div>
      {isSearchActive && (
        <>
          <div className="overlay active" onClick={handleCancelClick}></div>
          <button className="cancel-button" onClick={handleCancelClick}>취소</button>
        </>
      )}
      <div className="hd_bg"></div>
    </div>
  );
}

export default Header;