import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import './WhiskyEvents.css'; // CSS 파일을 임포트합니다.

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
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 변수
    const itemsPerPage = 5; // 페이지당 항목 수
    const navigate = useNavigate(); // useNavigate 훅 사용

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
            console.error('Error fetching events:', err); // 콘솔에 오류 출력
            if (err.message === 'No token found') {
                setError('로그인이 필요합니다.');
                navigate('/login'); // 로그인 페이지로 리디렉션
            } else {
                setError('이벤트를 불러오는 데 실패했습니다.');
            }
            setLoading(false);
        }
    }, [navigate]); // navigate를 의존성으로 추가

    useEffect(() => {
        fetchWhiskyEvents();
    }, [fetchWhiskyEvents]);

    // 현재 페이지의 항목을 계산
    const indexOfLastEvent = currentPage * itemsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

    // 페이지 변경 핸들러
    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 페이지 번호 생성
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(events.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container">
            <h2 className="title">위스키 행사 정보</h2>
            <div className="news-list">
                {currentEvents.map((event, index) => (
                    <div key={index} className="news-item">
                        {event.imageUrl && (
                            <div className="news-image-container">
                                <img src={event.imageUrl} alt={stripHtmlTags(event.title)} className="news-image" />
                            </div>
                        )}
                        <div className="news-content">
                            <h3>{decodeHtmlEntities(stripHtmlTags(event.title))}</h3>
                            <p>{decodeHtmlEntities(stripHtmlTags(event.description))}</p>
                            <a href={event.link} target="_blank" rel="noopener noreferrer">자세히 보기</a>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pagination">
                {pageNumbers.map(number => (
                    <button key={number} onClick={() => handleClick(number)} className={number === currentPage ? 'active' : ''}>
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default WhiskyEvents;
