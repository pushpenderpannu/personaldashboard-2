import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, CssBaseline } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Dashboard from './components/Dashboard';
import SettingsModal from './components/SettingsModal';
import NotificationBell from './components/NotificationBell';
import AddWidgetMenu from './components/AddWidgetMenu';
import { requestNotificationPermission } from './services/notificationService';
import axios from 'axios';

// Set axios base URL
axios.defaults.baseURL = 'http://localhost:3001';

// Note: resizeHandles has been removed to restore freeform resizing.
const initialLayout = [
  { i: 'weather', x: 0, y: 0, w: 21, h: 7 },
  { i: 'stocks', x: 21, y: 0, w: 42, h: 14 },
  { i: 'news', x: 0, y: 7, w: 21, h: 7 },
  { i: 'twitter', x: 63, y: 0, w: 21, h: 28 },
  { i: 'taskList', x: 0, y: 14, w: 42, h: 14 },
  { i: 'calendar', x: 42, y: 14, w: 42, h: 14 },
];

const widgetDefaultDimensions = {
  weather: { w: 21, h: 7 },
  stocks: { w: 42, h: 14 },
  news: { w: 21, h: 7 },
  twitter: { w: 21, h: 28 },
  taskList: { w: 42, h: 14 },
  calendar: { w: 42, h: 14 },
};

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    requestNotificationPermission();
    fetchConfig();
    const savedLayout = localStorage.getItem('dashboardLayout');
    if (savedLayout && JSON.parse(savedLayout).length > 0) {
      setLayout(JSON.parse(savedLayout));
    } else {
      setLayout(initialLayout);
    }
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await axios.get('/api/config');
      setConfig(response.data);
    } catch (error) {
      console.error("Failed to fetch config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLayoutChange = (newLayout) => {
    // Persist layout to localStorage
    if (newLayout.length > 0) {
      localStorage.setItem('dashboardLayout', JSON.stringify(newLayout));
    } else if (layout.length > 0) {
      // Handle case where all widgets are removed
      localStorage.setItem('dashboardLayout', JSON.stringify([]));
    }
    setLayout(newLayout);
  };

  const handleAddWidget = (widgetId) => {
    const newWidget = {
      i: widgetId,
      x: 0,
      y: Infinity, // Puts it at the bottom
      ...widgetDefaultDimensions[widgetId],
    };
    const newLayout = [...layout, newWidget];
    setLayout(newLayout); // Let layoutChange handler save it
  };

  const handleRemoveWidget = (widgetId) => {
    const newLayout = layout.filter(w => w.i !== widgetId);
    setLayout(newLayout); // Let layoutChange handler save it
  };

  const handleSettingsOpen = () => setSettingsOpen(true);
  const handleSettingsClose = () => setSettingsOpen(false);

  const handleConfigSave = async (newConfig) => {
    try {
      await axios.post('/api/config', newConfig);
      setConfig(newConfig);
      handleSettingsClose();
      window.location.reload();
    } catch (error) {
      console.error("Failed to save config:", error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Nexus Dashboard
          </Typography>
          <AddWidgetMenu currentWidgets={layout} onAddWidget={handleAddWidget} />
          <NotificationBell />
          <IconButton color="inherit" onClick={handleSettingsOpen}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {loading ? (
          <Typography>Loading configuration...</Typography>
        ) : (
          <Dashboard
            layout={layout}
            onLayoutChange={handleLayoutChange}
            onRemoveWidget={handleRemoveWidget}
          />
        )}
        {config && (
          <SettingsModal
            open={settingsOpen}
            handleClose={handleSettingsClose}
            config={config}
            onSave={handleConfigSave}
          />
        )}
      </Box>
    </Box>
  );
}

export default App;
