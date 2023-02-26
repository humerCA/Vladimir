import React from "react";
import { Box, Skeleton } from "@mui/material";

const MasterlistSkeleton = (props) => {
  const { onImport } = props;

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          right: 15,
          gap: "10px",
          top: 30,
        }}
      >
        {Boolean(onImport) && (
          <Skeleton variant={"rounded"} width="100px" height="33px" />
        )}
        <Skeleton variant={"rounded"} width="70px" height="33px" />
      </Box>

      <Box className="mcontainer__wrapper">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            gap: "20px",
          }}
        >
          <Skeleton variant={"rounded"} width="120px" height="40px" />
          <Skeleton variant={"rounded"} width="220px" height="40px" />
        </Box>

        <Box sx={{ padding: "5px 20px" }}>
          <Skeleton
            variant={"rounded"}
            height="40px"
            sx={{ marginBottom: "10px" }}
          />
          <Skeleton variant={"rounded"} height="46.5vh" />
        </Box>

        <Box sx={{ padding: "5px 20px 10px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Skeleton variant={"rounded"} width="100px" height="35px" />

            <Skeleton variant={"rounded"} width="300px" height="35px" />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MasterlistSkeleton;
