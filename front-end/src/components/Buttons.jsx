import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export const ButtonSizes = ({onClick, children}) => {
  return (
    <Box sx={{ '& button': { m: 1} }}>
      <div>
        <Button 
        onClick={onClick} 
        variant="contained" 
        size="small" 
        sx = {{backgroundColor: '#263238', color: 'white', width: '25ch'}} 
        >
          {children}
        </Button>    
      </div>
    </Box>
  );
}
