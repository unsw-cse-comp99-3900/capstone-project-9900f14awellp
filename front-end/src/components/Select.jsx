import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';

function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
const invoices = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];
export const SelectSmall = ()=>{
    const theme = useTheme();
    const [personName, setPersonName] = React.useState('');

    const handleChange = (event) => {
        setPersonName(event.target.value); // 确保选中的值是一个字符串
    };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">Invoice</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={personName}
        label="invoice"
        onChange={handleChange}
      >
        <MenuItem disabled value="">
            <em>choice a invoice</em>
         </MenuItem>
        {invoices.map((name) => (
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
  );
}
