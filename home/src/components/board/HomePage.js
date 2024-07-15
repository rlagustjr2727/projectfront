import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BoardService from '../../api/BoardService';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Box, CircularProgress } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import './HomePage.css'; // CSS 파일을 import

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await BoardService.getRecentBoards();
        setItems(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // items가 배열인지 확인
  if (!Array.isArray(items)) {
    return <div>Error: items is not an array</div>;
  }

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        최근 게시글
      </Typography>
      <List>
        {items.map((item, index) => (
          <ListItem 
            key={index} 
            alignItems="flex-start"
            component={Link} 
            to={`/board/detail/${item.boardSeq}`} 
            className="list-item"
          >
            <ListItemAvatar>
              <Avatar>
                <CommentIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="h5" component="span" className="primary-text">
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
                  {" — "}댓글 수: {item.commentCount}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default HomePage;
