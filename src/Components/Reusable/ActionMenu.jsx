import React, { useState } from "react";
import { useNavigate } from "react-router";

import { useDispatch } from "react-redux";
import { openDrawer } from "../../Redux/StateManagement/drawerSlice";

import {
  Box,
  IconButton,
  MenuItem,
  Menu,
  Fade,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  MoreVert,
  BorderColor,
  MoveToInbox,
  RestartAlt,
  Reply,
} from "@mui/icons-material";

const ActionMenu = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data,
    onArchiveRestoreHandler,
    onResetHandler,
    onUpdateHandler,
    status,
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleArchiveRestore = () => {
    onArchiveRestoreHandler(data?.id);
    handleClose();
  };

  const handleReset = () => {
    onResetHandler(data?.id);
    handleClose();
  };

  const handleEdit = () => {
    onUpdateHandler(data);
    dispatch(openDrawer());
    handleClose();
  };

  return (
    <Box>
      <IconButton onClick={handleOpen}>
        <MoreVert />
      </IconButton>
      <Menu
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        disablePortal
      >
        {status === "active" && (
          <MenuItem onClick={handleEdit} dense>
            <ListItemIcon>
              <BorderColor />
            </ListItemIcon>
            <ListItemText disableTypography>Edit</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleArchiveRestore} dense>
          <ListItemIcon>
            {status === "active" ? <MoveToInbox /> : <Reply />}
          </ListItemIcon>
          <ListItemText disableTypography>
            {status === "active" ? "Archive" : "Restore"}
          </ListItemText>
        </MenuItem>

        {status === "active" && onResetHandler !== undefined && (
          <MenuItem onClick={handleReset} dense>
            <ListItemIcon>
              <RestartAlt />
            </ListItemIcon>
            <ListItemText disableTypography>Reset</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default ActionMenu;
