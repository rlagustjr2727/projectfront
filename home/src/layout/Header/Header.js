import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import $ from 'jquery';
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

  useEffect(() => {
    const gnb = $('#gnb');
    const hdBg = $('.hd_bg');

    gnb.mouseenter(() => {
      $('.inner_menu').fadeIn(1000);
      const menuHeight = $('#header').outerHeight();
      const inmeHeight = $('.inner_menu').outerHeight();
      hdBg.css({
        top: `${menuHeight}px`,
        height: `${inmeHeight}px`,
      });

      hdBg.addClass('active').animate({
        top: '50%',
      }, 300);
    });

    gnb.mouseleave(() => {
      $('.inner_menu').hide();
      hdBg.css('height', '0');
      hdBg.removeClass('active');
    });

    $('.dept1').mouseenter(function () {
      $(this).children().addClass('active');
      $(this).siblings().children().removeClass('active');
    });

    $('.dept1').mouseleave(function () {
      $(this).children().removeClass('active');
    });
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

  const onLogoClickHandler = () => {
    navigate(MAIN_PATH());
  };

  const handleCommunityClick = () => {
    navigate('/board');
    setUserInput('');
    setIsSearchActive(false);
    setShowPopularSearch(false);
  };
  return (
    <div id="header">
      <div className='header-container'>
        <div className='header-left-box' onClick={onLogoClickHandler}>
          <div className='icon-box'>
            <div className='icon whisky-black-icon'></div>
          </div>
        </div>
      </div>
      <ul id="gnb">
        <li className="dept1">
          <a onClick={() => navigate('/filtersearch')}>맞춤 추천</a>
          <ul className="inner_menu">
            <li className="dept2"><a onClick={() => navigate('/wboard')}>WhiskeyBoard</a></li>
          </ul>
        </li>
        <li className="dept1">
          <a onClick={handleCommunityClick}>커뮤니티</a>
          <ul className="inner_menu">
            <li className="dept2"><a onClick={() => navigate(BOARD_PATH())}>자유 게시판</a></li>
            <li className="dept2"><a href="#">나눔 게시판</a></li>
            <li className="dept2"><a href="#">장터 게시판</a></li>
            <li className="dept2"><a href="#">정보 게시판</a></li>
          </ul>
        </li>
        <li className="dept1">
          <a href="#">위스키</a>
          <ul className="inner_menu">
            <li className="dept2"><a href="#">몰트 위스키</a></li>
            <li className="dept2"><a href="#">블랜디드 위스키</a></li>
            <li className="dept2"><a href="#">버번 위스키</a></li>
            <li className="dept2"><a href="#">리큐르(수정해야함)</a></li>
          </ul>
        </li>
        <li className="dept1">
          <a href="#">공지사항</a>
          <ul className="inner_menu">
            <li className="dept2"><a onClick={() => navigate('/whisky/events')}>행사정보</a></li>
            <li className="dept2">중요 공지<a href="#"></a></li>
            <li className="dept2">필독 공지<a href="#"></a></li>
          </ul>
        </li>
      </ul>

      <div className='header-container-right'></div>

      <div className={`search-container ${isSearchActive ? 'active' : ''}`} ref={searchRef}>
        <div className="search-input">
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