import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Box, CircularProgress, Grid, Paper } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import BoardService from '../../api/BoardService';
import './HomePage.css'; // CSS 파일을 import

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await BoardService.getRecentBoards();
        setItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    const fetchExchangeRates = async () => {
      try {
        // 환율 정보를 가져오는 API 호출 (여기서는 예시로 넣었습니다)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        const filteredRates = {
          USD: data.rates.USD,
          EUR: data.rates.EUR,
          JPY: data.rates.JPY
        };
        setExchangeRates(filteredRates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchItems();
    fetchExchangeRates();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h5">No recent boards available.</Typography>
      </Box>
    );
  }

  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <Container className="main-board-container">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" className="section-title" gutterBottom>
            최근 게시글
          </Typography>
          <List>
            {items.slice(0, 5).map((item, index) => (  // 게시글 목록을 슬라이스하여 최대 5개까지만 표시
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
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className="sidebar-paper">
            <div className="time-container">
              <Typography variant="h5" gutterBottom style={{fontWeight: '600', color: '#007bff'}}> 
                현재 시간
              </Typography>
              <Typography variant="h4" className="time" style={{fontSize:'2.1em'}}>
                {currentTime}
              </Typography>
            </div>
            <Typography variant="h5" gutterBottom style={{fontWeight: '600', color: '#007bff'}}>
              환율 정보
            </Typography>
            <table className="exchange-rates">
              <thead>
                <tr>
                  <th style={{fontWeight:'600', fontSize:'0.85em'}}>통화</th>
                  <th style={{fontWeight:'600', fontSize:'0.85em'}}>환율</th>
                </tr>
              </thead>
              <tbody>
                {exchangeRates ? (
                  Object.entries(exchangeRates).map(([currency, rate]) => (
                    <tr key={currency} style={{fontWeight:'500', fontSize:'0.85em'}}>
                      <td className="currency">{currency}</td>
                      <td>{rate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2">환율 정보를 불러오는 중...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
