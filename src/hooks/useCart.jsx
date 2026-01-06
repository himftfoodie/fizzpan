import { useState } from "react";
import { useMediaQuery } from "@mui/material";

const useCart = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [open, setOpen] = useState(false);

  const drawerSx = {
    width: isMobile ? "100vw" : 500,
    marginTop: "68px",
  };

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return {
    open,
    handleToggle,
    drawerSx,
    isMobile,
  };
};

export default useCart;
