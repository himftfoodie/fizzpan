import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useMediaQuery } from '@mui/material';


const useStyles = makeStyles({
  drawerPaper: {
    width: 500,
    marginTop: 68,
  },
});

const useStylesForMobile = makeStyles({
  drawerPaper: {
    width: "100vw",
    marginTop: 68,
  },
});

const useCart = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const classes = isMobile?useStylesForMobile(): useStyles();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return {
    open,
    handleToggle,
    classes,
  };
};

export default useCart;