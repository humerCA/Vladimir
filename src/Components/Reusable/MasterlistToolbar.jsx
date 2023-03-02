import React, { useEffect, useState } from "react";
import "../../Style/Masterlist/masterlistToolbar.scss";
import { Box } from "@mui/system";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { LibraryAdd, SystemUpdateAltRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { openDrawer } from "../../Redux/StateManagement/drawerSlice";

const MasterlistToolbar = (props) => {
  const {
    path = "",
    onStatusChange = () => {},
    onSearchChange = () => {},
    onSetPage = () => {},
    onImport,
  } = props;

  const searchHandler = (e) => {
    if (e.key === "Enter") {
      onSearchChange(e.target.value);
      onSetPage(1);
    }
  };

  const statusHandler = (e) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      onSetPage(1);
      return onStatusChange("deactivated");
    }
    onSetPage(1);
    return onStatusChange("active");
  };

  const dispatch = useDispatch();

  const handleOpenDrawer = () => {
    dispatch(openDrawer());
  };

  return (
    <Box className="masterlist-toolbar">
      <Box className="masterlist-toolbar__container">
        <Box className="toolbar__button-wrapper">
          <FormControlLabel
            control={<Checkbox size="small" onClick={statusHandler} />}
            label="ARCHIVED"
          />
        </Box>

        <Box className="masterlist-toolbar__addBtn">
          {Boolean(onImport) && (
            <Button
              component={Link}
              to={path}
              onClick={onImport}
              variant="contained"
              startIcon={<SystemUpdateAltRounded />}
              size="small"
              color="secondary"
            >
              Import
            </Button>
          )}

          <Button
            component={Link}
            to={path}
            onClick={handleOpenDrawer}
            variant="contained"
            startIcon={<LibraryAdd />}
            size="small"
          >
            Add
          </Button>
        </Box>

        <TextField
          autoComplete="off"
          variant="outlined"
          name="search"
          label="🔍︎ Search"
          // label="🔍 Search"
          type="text"
          size="small"
          color="secondary"
          sx={{
            ".MuiInputBase-root": {
              borderRadius: "15px",
              border: ".5px",
              background: "#f4f4f4",
            },
          }}
          onKeyPress={searchHandler}
        />
      </Box>
    </Box>
  );
};

export default MasterlistToolbar;
