import React from "react";
import "../Style/errorFetching.scss";
import { Box, Button, Typography } from "@mui/material";

const ErrorFetching = (props) => {
  const { refetch } = props;

  const reload = () => {
    location.reload();
  };

  return (
    <Box className="errorFetching">
      <Box className="errorFetching__wrapper">
        <Typography
          className="errorFetching__typo"
          sx={{ fontSize: "2rem", fontWeight: "bold" }}
        >
          Something went wrong!
        </Typography>
        <Button variant="contained" onClick={refetch}>
          Try Again
        </Button>
      </Box>
      <Box className="errorFetching__svgBg" />
    </Box>
  );
};

export default ErrorFetching;
