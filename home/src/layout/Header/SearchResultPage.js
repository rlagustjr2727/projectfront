import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SearchService from '../../api/SearchService';
import Card from '../../components/WhiskeyBoard/components/Card';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import './SearchResultPage.css';

const SearchResultPage = () => {
    const { keyword } = useParams();
    const [results, setResults] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [popularSearchTerms, setPopularSearchTerms] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const resultResponse = await SearchService.search(keyword);
                console.log('Search Results:', resultResponse); // 검색 결과 확인
                setResults(resultResponse.boards);
                setRecommendations(resultResponse.recommendations);

                const popularResponse = await SearchService.getPopularSearchTerms(10);
                setPopularSearchTerms(popularResponse);
            } catch (err) {
                setError(err);
            }
            setLoading(false);
        };

        fetchData();
    }, [keyword]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="search-result-page">
            <h1>검색 결과</h1>
            <br/><hr/><br/>
            <h2>게시판</h2>
            <div className="search-results">
                {results.length > 0 ? (
                    <List>
                        {results.slice(0, 5).map((item, index) => (
                            <ListItem 
                                key={index} 
                                alignItems="flex-start"
                                component={Link} 
                                to={`/board/detail/${item.boardSeq}`} 
                                className="list-item"
                            >
                                <ListItemAvatar className="list-item-avatar">
                                    <Avatar>
                                        <CommentIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="h6" component="span" className="primary-text">
                                            {item.boardTitle}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body1" component="span" className="secondary-text">
                                            <Typography
                                                component="span"
                                                variant="body1"
                                                color="textPrimary"
                                                className="category-text"
                                            >
                                                {item.boardCategory}
                                            </Typography>
                                            {"　　"}댓글 수: {item.commentCount}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <p>검색 결과가 없습니다.</p>
                )}
            </div>
            <br/><hr/><br/>
            <h2>맞춤 추천</h2>
            <div className="card-container">
                {recommendations.length > 0 ? (
                    recommendations.slice(0, 6).map((recommendation, index) => (
                        <Card
                            key={index}
                            wboard_img={recommendation.wboard_img}
                            wboard_name={recommendation.wboard_name}
                            wboard_info={recommendation.wboard_info}
                            wboard_type={recommendation.wboard_type}
                            wboard_origin={recommendation.wboard_origin}
                            wboard_abv={recommendation.wboard_abv}
                            wboard_tip={recommendation.wboard_tip}
                            wboard_yo={recommendation.wboard_yo}
                            wboard_abv_type={recommendation.wboard_abv_type}
                            onDelete={() => console.log('삭제 기능')}
                            onUpdate={() => console.log('수정 기능')}
                        />
                    ))
                ) : (
                    <p>맞춤 추천 결과가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default SearchResultPage;
