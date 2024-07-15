import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
//import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DoneIcon from '@mui/icons-material/Done';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Checkbox from '@mui/material/Checkbox';

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


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export const NestedList = () =>{
  const [openValidatedPass, setOpenValidatedPass] = React.useState(true);
  const [openValidatedFail, setOpenValidatedFail] = React.useState(true);
  const [openUnvalidated, setOpenUnvalidated] = React.useState(true);

  const passClick = () => {
    setOpenValidatedPass(!openValidatedPass);
  };
  const failClick = () => {
    setOpenValidatedFail(!openValidatedFail);
  };
  const unClick = () => {
    setOpenUnvalidated(!openUnvalidated);
  };

  return (
    <List
      sx={{ width: '100%', maxWidth: 360 }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      // subheader={
      //   <ListSubheader component="div" id="nested-list-subheader">
      //     Choice your invoices
      //   </ListSubheader>
      // }
    >
      <ListItemButton onClick={passClick}>
        <ListItemIcon>
          <DoneIcon />
        </ListItemIcon>
        <ListItemText primary="Verification Success" />
        {openValidatedPass ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openValidatedPass} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
             <Checkbox {...label}  color="default" />
            <ListItemText primary="passed-invoice-1" />
          </ListItemButton>
        </List>
      </Collapse>
      <ListItemButton onClick={failClick}>
        <ListItemIcon>
          <ErrorOutlineIcon />
        </ListItemIcon>
        <ListItemText primary="Verification Failed" />
        {openValidatedFail ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openValidatedFail} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
             <Checkbox {...label}  color="default" />
            <ListItemText primary="failed-invoice-1" />
          </ListItemButton>
        </List>
      </Collapse>
      <ListItemButton onClick={unClick}>
        <ListItemIcon>
          <QuestionMarkIcon />
        </ListItemIcon>
        <ListItemText primary="Unvalidated" />
        {openUnvalidated ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openUnvalidated} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
             <Checkbox {...label}  color="default" />
            <ListItemText primary="unvalidated-invoice-1" />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
}
