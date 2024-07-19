import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';


export const ButtonSizes = ({onClick, children}) => {
  return (
    <Box sx={{ '& button': { m: 1} }}>
      <div>
        <Button 
        fullWidth
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

export const IconLabelButtons = ()=> {
  return (
    <Stack direction="row" spacing={2}>
      <Button variant="contained" sx = {{backgroundColor: '#eeeeee', color: 'black'}} startIcon={<DeleteIcon /> }>
        Clear
      </Button>
      <Button variant="contained" endIcon={<SendIcon />}sx = {{backgroundColor: '#263238', color: 'white'}} >
        Send
      </Button>
    </Stack>
  );
}