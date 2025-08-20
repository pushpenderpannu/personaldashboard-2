import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, CssBaseline } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Dashboard from './components/Dashboard';
import SettingsModal from './components/SettingsModal';
import NotificationBell from './components/NotificationBell';
import { requestNotificationPermission } from './services/notificationService';
import axios from 'axios';

// Set axios base URL
axios.defaults.baseURL = 'http://localhost:3001';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    requestNotificationPermission();
    fetchConfig();
  }, []);

  const handleSettingsOpen = () => setSettingsOpen(true);
  const handleSettingsClose = () => setSettingsOpen(false);

  const handleConfigSave = async (newConfig) => {
    try {
      await axios.post('/api/config', newConfig);
      setConfig(newConfig);
      handleSettingsClose();
      // Optionally, force a refresh of all widgets
      window.location.reload(); // Simple way to refresh all data
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
          <Dashboard config={config} />
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
