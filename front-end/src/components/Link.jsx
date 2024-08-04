import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';


export const UnderlineLink = ({onClick, children, fontsize}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        typography: 'body1',
        '& > :not(style) ~ :not(style)': {
          ml: 1,
        },
      }}
      onClick={onClick}
    >
      <Link 
        href="#" 
        underline="hover" 
        color="inherit"
        style={{ fontSize: fontsize }} 
        >
        {children}
      </Link>
    </Box>
  );
}

export const AlignRight = ({ children }) => {
    return (
      <Box sx={{ marginLeft: 'auto' }}>
        {children}
      </Box>
    );
  };
  
