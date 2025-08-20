import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, CircularProgress, Link } from '@mui/material';

const NewsWidget = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/news');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch news.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 900000); // Refresh every 15 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {data && (
        <Box>
          <Typography
            variant="body2"
            sx={{ whiteSpace: 'pre-wrap', fontStyle: 'italic' }}
          >
            {data.summary}
          </Typography>
          <Box mt={2}>
            <Typography variant="subtitle2">Original Articles:</Typography>
            {data.articles.map((article, index) => (
              <Typography key={index} variant="body2">
                - {article.title} ({article.source})
              </Typography>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default NewsWidget;
