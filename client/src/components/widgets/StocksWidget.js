import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const StocksWidget = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/stocks');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch stock data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const getChangeColor = (change) => {
    if (change > 0) return 'success.main';
    if (change < 0) return 'error.main';
    return 'text.secondary';
  };

  return (
    <>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {data.length > 0 && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Change</TableCell>
              <TableCell align="right">% Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell component="th" scope="row">{stock.symbol}</TableCell>
                <TableCell align="right">${stock.price}</TableCell>
                <TableCell align="right" sx={{ color: getChangeColor(stock.change) }}>
                  {stock.change}
                </TableCell>
                <TableCell align="right" sx={{ color: getChangeColor(stock.changePercent) }}>
                  {stock.changePercent}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default StocksWidget;
