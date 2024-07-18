import React, { useState, useEffect, useRef } from 'react';
import DetailList from './DetailList';
import { useNavigate } from 'react-router-dom';
import SearchService from '../../api/SearchService';

const SearchPage = () => {
    const [userInput, setUserInput] = useState('');
    const [trendingList, setTrendingList] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [showPopularSearch, setShowPopularSearch] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    useEffect(() => {
        const fetchPopularSearchTerms = async () => {
            try {
                const response = await SearchService.getPopularSearchTerms(10);
                setTrendingList(response.data);
            } catch (error) {
                console.error('Error fetching popular search terms:', error);
            }
        };

        fetchPopularSearchTerms();

        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowPopularSearch(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputClick = () => {
        setShowPopularSearch(true);
    };

    const handleItemClick = (keyword) => {
        navigate(`/search/${keyword}`);
        setUserInput('');  // Clear the input field
        setShowPopularSearch(false);  // Hide the popular search list
    };

    const handleUserInputChange = (event) => {
        const value = event.target.value;
        setUserInput(value);
        setShowPopularSearch(value === '');
    };

    const handleSearchClick = () => {
        navigate(`/search/${userInput}`);
        setUserInput('');  // Clear the input field
        setShowPopularSearch(false);  // Hide the popular search list
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    return (
        <div className="search-page" ref={searchRef}>
            <div className="search-input">
                <input
                    type="text"
                    value={userInput}
                    onChange={handleUserInputChange}
                    onClick={handleInputClick}
                    onKeyPress={handleKeyPress}
                    placeholder="검색어를 입력하세요"
                />
                <button onClick={handleSearchClick}>검색</button>
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
    );
};

export default SearchPage;
