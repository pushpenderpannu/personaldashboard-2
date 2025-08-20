import React from 'react';
import { Badge, IconButton, Popover, Typography, List, ListItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const notifications = []; // Mock data

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <IconButton
        aria-describedby={id}
        color="inherit"
        onClick={handleClick}
      >
        <Badge badgeContent={notifications.length} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List>
          {notifications.length === 0 ? (
            <ListItem>
              <Typography>No new notifications</Typography>
            </ListItem>
          ) : (
            notifications.map((notif) => (
              <ListItem key={notif.id}>
                <Typography>{notif.text}</Typography>
              </ListItem>
            ))
          )}
        </List>
      </Popover>
    </div>
  );
};

export default NotificationBell;
