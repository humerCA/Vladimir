import React, { useState } from "react";
import "../../Style/confirmation.scss";

// RTK
import { closeConfirm } from "../../Redux/StateManagement/confirmSlice";
import { useDispatch } from "react-redux";

// MUI
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SvgIcon,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const Confirmation = (props) => {
  const dispatch = useDispatch();

  const { message, icon, iconProps, onConfirm } = props;

  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    dispatch(closeConfirm());
  };

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <Box className="confirmation">
      <SvgIcon
        component={icon}
        sx={{ fontSize: "50px", color: "#ffa000", ...iconProps }}
      />
      <DialogTitle
        className="confirmation__title"
        color="secondary"
        sx={{ fontFamily: "Anton", fontSize: "1.5rem", padding: 0 }}
      >
        Confirmation
      </DialogTitle>

      <DialogContent sx={{ padding: 0, paddingBottom: 1 }}>
        <DialogContentText component="div">{message}</DialogContentText>
      </DialogContent>

      <DialogActions className="confirmation__btn">
        <Button
          autoFocus
          variant="outlined"
          color="secondary"
          onClick={handleClose}
        >
          No
        </Button>

        <LoadingButton
          color="primary"
          onClick={handleConfirm}
          loading={loading}
          variant="contained"
        >
          <span>Yes</span>
        </LoadingButton>
      </DialogActions>
    </Box>
  );
};

export default Confirmation;
