import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const SearchResultPage = () => {
    const { keyword } = useParams();
    const [results, setResults] = useState([]);
    const [popularSearchTerms, setPopularSearchTerms] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/search?keyword=${keyword}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setResults(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });

        fetch('/api/search/popular?limit=10')
            .then(response => response.json())
            .then(data => setPopularSearchTerms(data))
            .catch(error => console.error('Error fetching popular search terms:', error));
    }, [keyword]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>검색 결과 : {keyword}</h1>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>
                        <Link to={`/board/detail/${result.boardSeq}`}>
                            {result.boardTitle}
                        </Link>
                        <p>{result.boardContent}</p>
                        <p>{result.boardAuthor} - {new Date(result.boardDate).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
            <h2>인기 검색어</h2>
            <ul>
                {popularSearchTerms.map((term, index) => (
                    <li key={index}>{term.searchKeyword} (검색 횟수: {term.searchCount})</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResultPage;
