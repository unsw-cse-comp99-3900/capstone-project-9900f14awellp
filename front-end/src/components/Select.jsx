
import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";



export const SelectSmall = ({ invoices, selectedInvoice, onChange }) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 100, width: '100%', maxHeight: 400 }} size="small">
      <InputLabel>Invoice</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        data-testid={dataTestId}
        value={personName}
        label="invoice"
        onChange={handleChange}
        //onClick={onclick}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {invoices.map((invoice, index) => (
          <MenuItem key={index} value={invoice}>
            {invoice}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};




function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxWidth: 200,
      overflowX: 'auto',
    },
  },
};





export const MultipleSelect = ({lists, onChange, selected, dataTestId}) => {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  useEffect(() => {
    setPersonName(selected || []);
  }, [selected]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    onChange(value); // 调用父组件传递的onChange处理函数
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 300, width: '100%', maxHeight: 400 }} size="small">
        <InputLabel id="demo-multiple-name-label">Rules</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          data-testid={dataTestId}
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          {lists.map((name) => (
            <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
