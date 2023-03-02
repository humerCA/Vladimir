import React, { useEffect, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../Components/Reusable/ActionMenu";
import AddMinorCategory from "../Masterlist/AddEdit/AddMinorCategory.jsx";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import {
  closeConfirm,
  openConfirm,
} from "../../Redux/StateManagement/confirmSlice";
import {
  useGetMinorCategoryApiQuery,
  usePutMinorCategoryStatusApiMutation,
} from "../../Redux/Query/Category/MinorCategory";

// MUI
import {
  Box,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Help, ReportProblem } from "@mui/icons-material";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import ErrorFetching from "../ErrorFetching";

const MinorCategory = () => {
  const category = true;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [updateMinorCategory, setUpdateMinorCategory] = useState({
    status: false,
    id: null,
    minor_category_name: "",
  });

  const drawer = useSelector((state) => state.drawer);

  const limitHandler = (e) => {
    setLimit(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const {
    data: minorCategoryData,
    isLoading: minorCategoryLoading,
    isSuccess: minorCategorySuccess,
    isError: minorCategoryError,
    refetch,
  } = useGetMinorCategoryApiQuery(
    {
      page: page,
      limit: limit,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [putMinorCategoryStatusApi, { isLoading }] =
    usePutMinorCategoryStatusApiMutation();

  const dispatch = useDispatch();

  const onArchiveRestoreHandler = (id) => {
    dispatch(
      openConfirm({
        icon: status === "active" ? ReportProblem : Help,
        message: (
          <Box>
            <Typography> Are you sure you want to</Typography>
            <Typography
              sx={{
                display: "inline-block",
                color: "secondary.main",
                fontWeight: "bold",
              }}
            >
              {status === "active" ? "ARCHIVE" : "ACTIVATE"}
            </Typography>{" "}
            this data?
          </Box>
        ),

        onConfirm: async () => {
          try {
            const result = await putMinorCategoryStatusApi({
              id: id,
              status: status === "active" ? false : true,
            }).unwrap();

            dispatch(
              openToast({
                message: result.message,
                duration: 5000,
              })
            );
            dispatch(closeConfirm());
          } catch (err) {
            console.log(err.message);
          }
        },
      })
    );
  };

  const onUpdateHandler = (props) => {
    const {
      id,
      minor_category_name,
      urgency_level,
      personally_assign,
      evaluate_in_every_movement,
    } = props;
    setUpdateMinorCategory({
      status: true,
      id: id,
      minor_category_name: minor_category_name,
      urgency_level: urgency_level,
      personally_assign: personally_assign,
      evaluate_in_every_movement: evaluate_in_every_movement,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateMinorCategory({
      status: false,
      id: null,
      minor_category_name: "",
      urgency_level: "",
      personally_assign: null,
      evaluate_in_every_movement: null,
    });
  };

  const onSetPage = () => {
    setPage(1);
  };

  return (
    <>
      {minorCategoryLoading && <MasterlistSkeleton category={category} />}

      {minorCategoryError && <ErrorFetching refetch={refetch} />}

      {minorCategoryData && (
        <Box className="mcontainer__wrapper">
          <MasterlistToolbar
            path="#"
            onStatusChange={setStatus}
            onSearchChange={setSearch}
            onSetPage={setPage}
          />

          <Box>
            <TableContainer className="mcontainer__th-body-category">
              <Table className="mcontainer__table" stickyHeader>
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
                    <TableCell className="mcontainer__th-cell mcontainer__text-center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {minorCategorySuccess &&
                    minorCategoryData.data.map((data) => (
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
                          {data.minor_category_name}
                        </TableCell>

                        <TableCell
                          className="mcontainer__tr-cell mcontainer__text-center
                    "
                        >
                          {data.urgency_level}
                        </TableCell>

                        <TableCell className="mcontainer__tr-cell mcontainer__text-center">
                          {data.personally_assign ? " Yes" : " No"}
                        </TableCell>

                        <TableCell className="mcontainer__tr-cell mcontainer__text-center">
                          {data.evaluate_in_every_movement ? " Yes" : " No"}
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
                          {Moment(data.created_at).format("MMM DD, YYYY")}
                        </TableCell>

                        <TableCell className="mcontainer__tr-cell mcontainer__text-center ">
                          <ActionMenu
                            status={status}
                            data={data}
                            onUpdateHandler={onUpdateHandler}
                            onArchiveRestoreHandler={onArchiveRestoreHandler}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box className="mcontainer__pagination">
            <TablePagination
              rowsPerPageOptions={[
                5,
                10,
                15,
                {
                  label: "All",
                  value: parseInt(minorCategoryData?.total),
                },
              ]}
              component="div"
              count={minorCategorySuccess ? minorCategoryData.total : 0}
              page={
                minorCategorySuccess ? minorCategoryData.current_page - 1 : 0
              }
              rowsPerPage={
                minorCategorySuccess ? parseInt(minorCategoryData?.per_page) : 5
              }
              onPageChange={pageHandler}
              onRowsPerPageChange={limitHandler}
            />
          </Box>

          <Dialog open={drawer} PaperProps={{ sx: { borderRadius: "10px" } }}>
            <AddMinorCategory
              data={updateMinorCategory}
              onUpdateResetHandler={onUpdateResetHandler}
            />
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default MinorCategory;
