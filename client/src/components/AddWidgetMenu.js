import React, { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  WbSunny, // Weather
  ShowChart, // Stocks
  Article, // News
  Twitter, // Twitter
  Checklist, // TaskList
  CalendarMonth, // Calendar
} from '@mui/icons-material';

const allWidgets = [
  { id: 'weather', name: 'Weather', icon: <WbSunny fontSize="small" /> },
  { id: 'stocks', name: 'Stocks', icon: <ShowChart fontSize="small" /> },
  { id: 'news', name: 'News', icon: <Article fontSize="small" /> },
  { id: 'twitter', name: 'Twitter Feed', icon: <Twitter fontSize="small" /> },
  { id: 'taskList', name: 'Task List', icon: <Checklist fontSize="small" /> },
  { id: 'calendar', name: 'Calendar', icon: <CalendarMonth fontSize="small" /> },
];

const AddWidgetMenu = ({ currentWidgets, onAddWidget }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAdd = (widgetId) => {
    onAddWidget(widgetId);
    handleClose();
  };

  const availableWidgets = allWidgets.filter(
    (widget) => !currentWidgets.find((w) => w.i === widget.id)
  );

  return (
    <div>
      <Button
        id="add-widget-button"
        aria-controls={open ? 'add-widget-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="contained"
        color="secondary"
        startIcon={<AddCircleOutlineIcon />}
      >
        Add Widget
      </Button>
      <Menu
        id="add-widget-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'add-widget-button',
        }}
      >
        {availableWidgets.length > 0 ? (
          availableWidgets.map((widget) => (
            <MenuItem key={widget.id} onClick={() => handleAdd(widget.id)}>
              <ListItemIcon>{widget.icon}</ListItemIcon>
              <ListItemText>{widget.name}</ListItemText>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>All widgets are currently displayed.</MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default AddWidgetMenu;
