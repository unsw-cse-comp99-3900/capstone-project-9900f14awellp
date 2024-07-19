import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useEffect } from 'react';

export default function OutlinedAlert({ severity, children, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    // Cleanup timer if component is unmounted before 10 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert variant="outlined" severity={severity}>
        {children}
      </Alert>
    </Stack>
  );
}
