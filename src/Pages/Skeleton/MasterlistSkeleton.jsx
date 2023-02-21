import { Box, Skeleton } from "@mui/material";
import React from "react";

const MasterlistSkeleton = () => {
  return (
    <Box>
      <Box className="toolbar" sx={{ marginTop: "10px" }}>
        <Box
          className="toolbar__button-wrapper"
          sx={{ display: "flex", gap: "20px" }}
        >
          <Skeleton variant={"rounded"} width={80} height={40} />
          <Skeleton variant={"rounded"} width={100} height={40} />
        </Box>

        <Box className="toolbar__textbox-wrapper">
          <Skeleton variant={"rounded"} width={120} height={40} />
        </Box>
      </Box>

      <Box sx={{ marginBottom: "10px" }}>
        <Skeleton
          variant={"rounded"}
          height={50}
          sx={{ marginBottom: "10px" }}
        />
        <Skeleton variant={"rounded"} height={300} />
      </Box>

      <Box>
        <Box
          className="toolbar__textbox-wrapper"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Skeleton variant={"rounded"} width={100} height={30} />

          <Skeleton variant={"rounded"} width={360} height={30} />
        </Box>
      </Box>
    </Box>
  );
};

export default MasterlistSkeleton;
