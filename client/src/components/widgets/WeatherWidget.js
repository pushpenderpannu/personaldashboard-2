import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Widget from '../Widget';
import { Typography, Box, CircularProgress } from '@mui/material';

const WeatherWidget = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/weather');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <Widget title="Weather">
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {data && (
        <Box>
          <Typography variant="h4">{data.city}</Typography>
          <Typography variant="h5">{data.temperature}</Typography>
          <Typography variant="subtitle1">{data.condition}</Typography>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            {data.insight}
          </Typography>
        </Box>
      )}
    </Widget>
  );
};

export default WeatherWidget;
