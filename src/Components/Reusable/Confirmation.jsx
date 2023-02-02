import React, { useState } from "react";
import "../../Style/confirmation.scss";

// RTK
import { closeConfirm } from "../../Redux/StateManagement/confirmSlice";
import { useDispatch } from "react-redux";

// MUI
import {
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
    <>
      <SvgIcon
        component={icon}
        sx={{ fontSize: "50px", color: "#ffa000", ...iconProps }}
      />
      <DialogTitle
        color="secondary"
        sx={{ fontFamily: "Anton", fontSize: "25px", padding: 0 }}
      >
        Confirmation
      </DialogTitle>

      <DialogContent>
        <DialogContentText component="div">{message}</DialogContentText>
      </DialogContent>

      <DialogActions sx={{ gap: "40px" }}>
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
    </>
  );
};

export default Confirmation;
