import { Box } from "@mui/material";
import React from "react";
import Body from "../Components/Body";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Sidebar from "../Components/Sidebar";
import "../Style/homePage.scss";

const HomePage = () => {
  return (
    <>
      <Box className="homepage">
        <Box className="homepage__sidebar">
          <Sidebar />
        </Box>

        <Box className="homepage__content">
          <Navbar />
          <Box className="homepage__body">
            <Body />
          </Box>
          <Footer />
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
