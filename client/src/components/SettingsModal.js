import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Grid } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const SettingsModal = ({ open, handleClose, config, onSave }) => {
  const [localConfig, setLocalConfig] = useState(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleChange = (widget, key, value) => {
    setLocalConfig(prev => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [widget]: {
          ...prev.widgets[widget],
          [key]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    onSave(localConfig);
  };

  if (!localConfig) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          Application Settings
        </Typography>
        <Grid container spacing={3}>
          {Object.entries(localConfig.widgets).map(([widgetName, settings]) => (
            <Grid item xs={12} key={widgetName}>
              <Typography variant="subtitle1" gutterBottom>{widgetName.charAt(0).toUpperCase() + widgetName.slice(1)}</Typography>
              {Object.entries(settings).map(([key, value]) => (
                <TextField
                  key={key}
                  label={`${key}`}
                  fullWidth
                  multiline={key.toLowerCase().includes('prompt')}
                  rows={key.toLowerCase().includes('prompt') ? 3 : 1}
                  value={Array.isArray(value) ? value.join(', ') : value}
                  onChange={(e) => handleChange(widgetName, key, key === 'symbols' || key === 'accounts' ? e.target.value.split(',').map(s => s.trim()) : e.target.value)}
                  variant="outlined"
                  margin="normal"
                />
              ))}
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" sx={{ ml: 2 }}>Save</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SettingsModal;
