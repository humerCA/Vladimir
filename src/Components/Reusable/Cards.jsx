import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const Cards = (props) => {
  const { title, icon, content } = props;
  return (
    <Box className="cards">
      <Box className="cards__container">
        <Button variant="contained" startIcon={icon}>
          <Typography>{title}</Typography>
          <Typography>{content}</Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default Cards;
