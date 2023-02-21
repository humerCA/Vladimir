import React from "react";
import { Box, Button, Typography } from "@mui/material";
import "../assets/errorFetching.style.scss";

const ErrorFetching = (props) => {
  const { refetch } = props;

  const reload = () => {
    location.reload();
  };

  return (
    <Box className="errorFetching">
      <Box className="errorFetching__wrapper">
        <Typography sx={{ fontSize: "2rem", fontWeight: "bold" }}>
          Something went Wrong!
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
