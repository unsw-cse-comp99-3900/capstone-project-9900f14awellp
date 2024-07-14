import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';

function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
const invoices = [
  'invoice_INV-2024-0001.pdf',
  'string.json',
  'invoice_data.json'
];
export const SelectSmall = ({onclick})=>{
    const theme = useTheme();
    const [personName, setPersonName] = React.useState('');

    const handleChange = (event) => {
        setPersonName(event.target.value); // 确保选中的值是一个字符串
    };

  return (
    <FormControl sx={{ m: 1, minWidth: 300 }} size="small">
      <InputLabel id="demo-select-small-label">Invoice</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={personName}
        label="invoice"
        onChange={handleChange}
        onClick={onclick}
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





export const MultipleSelect = ({lists}) => {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };


  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }} size="small">
        <InputLabel id="demo-multiple-name-label">Rules</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          {lists.map((name) => (
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
    </div>
  );
}
