import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
// import { CustomizedInputsStyled } from '../components/Inputs'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// const names = [
//   'Oliver Hansen',
//   'Van Henry',
//   'April Tucker',
//   'Ralph Hubbard',
//   'Omar Alexander',
//   'Carlos Abbott',
//   'Miriam Wagner',
//   'Bradley Wilkerson',
//   'Virginia Andrews',
//   'Kelly Snyder',
// ];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export const ChoiceCompanyForm = ({ open, handleClose , handleSubmit, names}) => {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState('');

  const handleChange = (event) => {
    setPersonName(event.target.value); // 确保选中的值是一个字符串
  };
  const handleFormSubmit = () => {
    handleSubmit(personName); // 将选中的公司名称传递给 handleSubmit
  };
  return (
    <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
      <DialogTitle>Company Select</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
            <Select
              displayEmpty
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em>choice a company</em>;
                }
                return selected;
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem disabled value="">
                <em>choice a company</em>
              </MenuItem>
              {names.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, personName, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">Cancel</Button>
        <Button onClick={handleFormSubmit} color="inherit">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export const CreateCompanyForm = ({ open, handleClose, handleSubmit, formData, handleChange }) => {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Create a company</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullwidth
              label="Company Name"
              name="name"
              value={formData.name || ''} 
              onChange={handleChange} 
              variant="outlined"
              margin="normal"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullwidth
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number || ''} 
                onChange={handleChange} 
                variant="outlined"
                margin="normal"
              />
            </Box>
            <TextField
              fullwidth
              label="Company Email address"
              name="email"
              value={formData.email || ''} 
              onChange={handleChange} 
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullwidth
              label="Australian Business Number(ABN)"
              name="ABN"
              value={formData.ABN || ''} 
              onChange={handleChange} 
              variant="outlined"
              margin="normal"
            />
            <TextField
              fullwidth
              label="Company address"
              name="address"
              value={formData.address || ''} 
              onChange={handleChange} 
              variant="outlined"
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="inherit">Cancle</Button>
          <Button onClick={handleSubmit} variant="contained" sx = {{backgroundColor: '#263238'}} >Submit</Button>
        </DialogActions>
      </Dialog>
    );
  };