import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';

function renderRow(props) {
  const { index, style } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={`Invoice ${index + 1}`} />
      </ListItemButton>
    </ListItem>
  );
}

export const VirtualizedList = ({ height }) => {
  return (
    <Box
      sx={{ 
        width: {
          xs: '30%', // 宽度在小屏幕设备上
          sm: '30%', // 30% 宽度在中等屏幕设备上
          md: '30%', // 30% 宽度在较大屏幕设备上
          lg: '30%', // 30% 宽度在超大屏幕设备上
        },
        height: height, 
        maxWidth: 360, 
        bgcolor: 'background.paper',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '0.5px',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.9)',
          zIndex: 1,
        }
      }}
    >
      <FixedSizeList
        height={height}
        width='100%'
        itemSize={46}
        itemCount={200}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
    </Box>
  );
}
