import React from 'react';
import { Card, CardHeader, CardContent, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const Widget = ({ title, children, onSettingsClick }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={title}
        action={
          onSettingsClick && (
            <IconButton onClick={onSettingsClick}>
              <SettingsIcon />
            </IconButton>
          )
        }
        sx={{
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          py: 1,
        }}
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
        {children}
      </CardContent>
    </Card>
  );
};

export default Widget;
