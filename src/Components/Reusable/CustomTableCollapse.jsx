import React, { useState } from "react";
import moment from "moment";
import ActionMenu from "./ActionMenu";

import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const CustomTableCollapse = (props) => {
  const {
    data,
    status,
    onUpdateHandler,
    onArchiveRestoreHandler,
    onAddMinorCategoryHandler,
  } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell className="mcontainer__tr-cell mcontainer__text-center">
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>

        <TableCell className="mcontainer__tr-cell">
          {data.service_provider.service_provider_name}
        </TableCell>

        <TableCell className="mcontainer__tr-cell">
          {data.major_category.major_category_name}
        </TableCell>

        <TableCell className="mcontainer__tr-cell mcontainer__text-center">
          {data.is_active ? (
            <Typography
              color="success.main"
              sx={{
                px: 1,
                maxWidth: "10ch",
                margin: "0 auto",
                fontSize: "13px",
                background: "#26f57c2a",
                borderRadius: "8px",
              }}
            >
              ACTIVE
            </Typography>
          ) : (
            <Typography
              align="center"
              color="errorColor.main"
              sx={{
                px: 1,
                maxWidth: "10ch",
                margin: "0 auto",
                fontSize: "13px",
                background: "#fc3e3e34",
                borderRadius: "8px",
              }}
            >
              INACTIVE
            </Typography>
          )}
        </TableCell>

        <TableCell className="mcontainer__tr-cell mcontainer__text-center">
          Date
        </TableCell>

        <TableCell className="mcontainer__tr-cell">
          <ActionMenu
            status={status}
            data={data}
            onUpdateHandler={onUpdateHandler}
            onArchiveRestoreHandler={onArchiveRestoreHandler}
            onAddMinorCategoryHandler={onAddMinorCategoryHandler}
          />
        </TableCell>
      </TableRow>

      <TableRow sx={{ background: "#eeeeee" }}>
        <TableCell
          sx={{ paddingBottom: 0, paddingTop: 0, border: 0 }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="p" gutterBottom sx={{ fontWeight: "bold" }}>
                Minor Category
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell className="mcontainer__th-cell mcontainer__text-center">
                      Id
                    </TableCell>

                    <TableCell
                      className="mcontainer__th-cell"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      Minor Category
                    </TableCell>

                    <TableCell
                      className="mcontainer__th-cell mcontainer__text-center"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      Urgency Level
                    </TableCell>

                    <TableCell className="mcontainer__th-cell mcontainer__text-center mcontainer__text-font">
                      Personally Assigned
                    </TableCell>

                    <TableCell className="mcontainer__th-cell mcontainer__text-center mcontainer__text-font">
                      Evaluated in Every Movement
                    </TableCell>

                    <TableCell className="mcontainer__th-cell mcontainer__text-center">
                      Status
                    </TableCell>

                    <TableCell
                      className="mcontainer__th-cell mcontainer__text-center"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      Date Created
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.category_list_tag.map((data) => (
                    <TableRow
                      key={data.id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableCell className="mcontainer__tr-cell mcontainer__text-center">
                        {data.id}
                      </TableCell>

                      <TableCell className="mcontainer__tr-cell">
                        {data.minor_category.minor_category_name}
                      </TableCell>

                      <TableCell
                        className="mcontainer__tr-cell mcontainer__text-center
                    "
                      >
                        {data.minor_category.urgency_level}
                      </TableCell>

                      <TableCell className="mcontainer__tr-cell mcontainer__text-center">
                        {data.minor_category.personally_assign ? " Yes" : " No"}
                      </TableCell>

                      <TableCell className="mcontainer__tr-cell mcontainer__text-center">
                        {data.minor_category.evaluate_in_every_movement
                          ? " Yes"
                          : " No"}
                      </TableCell>

                      <TableCell className="mcontainer__tr-cell mcontainer__text-center">
                        {data.minor_category.is_active ? (
                          <Typography
                            color="success.main"
                            sx={{
                              px: 1,
                              maxWidth: "10ch",
                              margin: "0 auto",
                              fontSize: "13px",
                              background: "#26f57c2a",
                              borderRadius: "8px",
                            }}
                          >
                            ACTIVE
                          </Typography>
                        ) : (
                          <Typography
                            align="center"
                            color="errorColor.main"
                            sx={{
                              px: 1,
                              maxWidth: "10ch",
                              margin: "0 auto",
                              fontSize: "13px",
                              background: "#fc3e3e34",
                              borderRadius: "8px",
                            }}
                          >
                            INACTIVE
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell className="mcontainer__tr-cell mcontainer__text-center">
                        {moment(data.minor_category.created_at).format(
                          "MMM DD, YYYY"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CustomTableCollapse;
