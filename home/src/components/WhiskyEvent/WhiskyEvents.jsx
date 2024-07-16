import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Grid, Paper, Typography, Button } from '@mui/material';
import './WhiskyEvents.css';

function stripHtmlTags(str) {
    if (!str) {
        return "";
    }
    return str.replace(/<[^>]*>/g, "");
}

function decodeHtmlEntities(str) {
    var txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
}

function WhiskyEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    const fetchWhiskyEvents = useCallback(async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await axios.get('/api/event/whisky', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setEvents(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching events:', err);
            if (err.message === 'No token found') {
                setError('로그인이 필요합니다.');
                navigate('/login');
            } else {
                setError('이벤트를 불러오는 데 실패했습니다.');
            }
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchWhiskyEvents();
    }, [fetchWhiskyEvents]);

    const indexOfLastEvent = currentPage * itemsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(events.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="event-container">
            <Typography 
                variant="h4" 
                align="center" 
                gutterBottom 
                style={{ fontSize: '1.3em', fontWeight: 'bold' }}
            >
                위스키 관련 뉴스
            </Typography>
            <Grid container direction="column" spacing={3}>
                {currentEvents.map((event, index) => (
                    <Grid item key={index}>
                        <Paper elevation={3} className="news-item">
                            <Grid container spacing={2}>
                                <Grid item>
                                    <div className="news-image-container">
                                        <img src={event.imageUrl} alt={stripHtmlTags(event.title)} className="news-image" />
                                    </div>
                                </Grid>
                                <Grid item xs>
                                    <div className="news-content">
                                        <Typography variant="h6">{decodeHtmlEntities(stripHtmlTags(event.title))}</Typography>
                                        <Typography variant="body2">{decodeHtmlEntities(stripHtmlTags(event.description))}</Typography>
                                        <Button href={event.link} target="_blank" rel="noopener noreferrer" className="detail-button">
                                            자세히 보기
                                        </Button>
                                    </div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <div className="event-pagination">
                {pageNumbers.map(number => (
                    <Button key={number} onClick={() => handleClick(number)} variant={number === currentPage ? 'contained' : 'outlined'}>
                        {number}
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default WhiskyEvents;
