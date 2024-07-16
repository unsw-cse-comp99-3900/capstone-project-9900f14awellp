import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

export const InputTextField = ({ label, id, variant, value, onChange }) => {
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': {  width: '50', maxWidth: '100%' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField 
        fullWidth
          id={id} 
          label={label} 
          variant={variant} 
          value={value}
          onChange={onChange}
          margin="normal"
        />
    </div>
    </Box>
  );
};

export const MultilineTextFields = ({ label, id, variant, value, onChange }) =>{
return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': {  width: '50', maxWidth: '100%' },
      }}
      noValidate
      autoComplete="off"
    >
        <TextField
         fullWidth
          id={id} 
          label={label} 
          variant={variant} 
          value={value}
          onChange={onChange}
          multiline
          rows={4}
          
        />   
    </Box>
  );

}

export const PasswordTextField = ({ id, label, value, onChange }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{ display: 'flex', flexWrap: 'wrap' }}
    >
      <div>
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="all-password">{label}</InputLabel>
          <OutlinedInput
            id={id}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label={label}
          />
        </FormControl>
      </div>
    </Box>
  );
};
const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? '#F3F6F9' : '#1A2027',
    border: '1px solid',
    borderColor: theme.palette.mode === 'light' ? '#E0E3E7' : '#2D3843',
    fontSize: 16,
    width: 'auto',
    padding: '10px 12px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));
export const CustomizedInputsStyled = () => {
  return (
    <Box
      component="form"
      noValidate
      sx={{
        display: 'grid',
        gridTemplateColumns: { sm: '1fr 1fr' },
        gap: 2,
      }}
    >
      <FormControl variant="standard">
        <InputLabel shrink htmlFor="bootstrap-input">
          Bootstrap
        </InputLabel>
        <BootstrapInput defaultValue="react-bootstrap" id="bootstrap-input" />
      </FormControl>
      </Box>
  );
}