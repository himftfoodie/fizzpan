import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';

export default function SnackMessage({msg, isErrorOccured}) {
  const [open, setOpen] = React.useState(false);

  const errorOccured = () => {
    setOpen(isErrorOccured);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={errorOccured}
        message={msg}
      />
    </div>
  );
}