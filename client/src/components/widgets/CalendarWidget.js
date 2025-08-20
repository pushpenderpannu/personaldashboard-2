import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, CircularProgress } from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const CalendarWidget = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/tasks');
        const formattedEvents = response.data.map(task => ({
          id: task.id,
          title: task.title,
          start: new Date(task.date),
          end: new Date(task.date), // For simplicity, tasks are single-day events
          allDay: true,
        }));
        setEvents(formattedEvents);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tasks for calendar.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
    // Potentially refetch on an interval or via a websocket
  }, []);

  return (
    <>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <Box sx={{ height: 'calc(100% - 16px)' }}> {/* Adjust height to fit within widget card */}
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
          />
        </Box>
      )}
    </>
  );
};

export default CalendarWidget;
