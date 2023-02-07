import { Box, Tab, Tabs, Typography } from "@mui/material";
import React from "react";

const Category = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="mcontainer">
      <Typography
        className="mcontainer__title"
        sx={{ fontFamily: "Anton", fontSize: "2rem" }}
      >
        Category Management
      </Typography>

      <Box>
        <Tabs onChange={handleChange} value={value}>
          <Tab label="Main Category" />
          <Tab label="Major Category" />
          <Tab label="Minor Category" />
        </Tabs>
      </Box>
    </Box>
  );
};

export default Category;
