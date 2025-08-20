import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, CircularProgress, List, ListItem, ListItemText, Divider } from '@mui/material';

const TwitterWidget = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/twitter');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tweets.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 120000); // Refresh every 2 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {data.length > 0 && (
        <List dense>
          {data.map((account) => (
            <React.Fragment key={account.account}>
              <ListItem>
                <ListItemText primary={<Typography variant="h6">{account.account}</Typography>} />
              </ListItem>
              {account.tweets.map((tweet, index) => (
                <React.Fragment key={tweet.id}>
                  <ListItem>
                    <ListItemText secondary={tweet.text} />
                  </ListItem>
                  {index < account.tweets.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </List>
      )}
    </>
  );
};

export default TwitterWidget;
