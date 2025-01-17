import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
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
// list
export const VirtualizedList = ({ height }) => {
  return (
    <Box
      sx={{ 
        width: {
          xs: '30%', 
          sm: '30%', 
          md: '30%', 
          lg: '30%', 
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


// for nested list in sending page
export const NestedList = ({ passedList, failedList, unvalidatedList, onInvoiceSelect, selectedInvoices }) =>{
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

  const handleCheckboxChange = (invoice) => {
    onInvoiceSelect(invoice);
 };
  return (
    <List
      sx={{ width: '100%', maxWidth: 360 }}
      component="nav"
      aria-labelledby="nested-list-subheader"
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
        {passedList.map((invoice, index) => (
            <ListItemButton key={index} sx={{ pl: 4 }}>
              <Checkbox 
              color="default" 
              checked={selectedInvoices.includes(invoice)}
              onChange={() => handleCheckboxChange(invoice)}
              />
              <ListItemText primary={invoice} />
            </ListItemButton>
          ))}
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
        {failedList.map((invoice, index) => (
            <ListItemButton key={index} sx={{ pl: 4 }}>
              <Checkbox 
              color="default" 
              checked={selectedInvoices.includes(invoice)}
              onChange={() => handleCheckboxChange(invoice)}
              />
              <ListItemText primary={invoice} />
            </ListItemButton>
          ))}
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
        {unvalidatedList.map((invoice, index) => (
            <ListItemButton key={index} sx={{ pl: 4 }}>
              <Checkbox 
              color="default" 
              checked={selectedInvoices.includes(invoice)}
              onChange={() => handleCheckboxChange(invoice)}
              />
              <ListItemText primary={invoice} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </List>
  );
}
