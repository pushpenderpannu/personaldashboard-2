import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, CircularProgress } from '@mui/material';
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
          end: new Date(task.date),
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
  }, []);

  return (
    <>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        // The CardContent in the base Widget provides the necessary padding and scrolling
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }} // A fixed height is often better for calendar
        />
      )}
    </>
  );
};

export default CalendarWidget;
