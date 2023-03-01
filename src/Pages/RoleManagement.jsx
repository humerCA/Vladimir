import React, { useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../Components/Reusable/ActionMenu";
import AddRole from "./Masterlist/AddEdit/AddRole";

// RTK
import { useDispatch } from "react-redux";
import { openToast } from "../Redux/StateManagement/toastSlice";
import { openDrawer } from "../Redux/StateManagement/drawerSlice";

import {
  openConfirm,
  closeConfirm,
} from "../Redux/StateManagement/confirmSlice";

import {
  usePostRoleStatusApiMutation,
  useGetRoleApiQuery,
} from "../Redux/Query/RoleManagementApi";

import { useSelector } from "react-redux";

// MUI
import {
  Box,
  Button,
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
import { Help, PageviewRounded, ReportProblem } from "@mui/icons-material";
import MasterlistSkeleton from "./Skeleton/MasterlistSkeleton";
import ErrorFetching from "./ErrorFetching";

const Role = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [updateRole, setUpdateRole] = useState({
    status: false,
    action: "",
    id: null,
    role_name: "",
    access_permission: [],
  });

  const drawer = useSelector((state) => state.drawer);

  const limitHandler = (e) => {
    setLimit(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    console.log(page + 1);
    setPage(page + 1);
  };

  const {
    data: roleData,
    isLoading: roleLoading,
    isSuccess: roleSuccess,
    isError: roleError,
    refetch,
  } = useGetRoleApiQuery(
    {
      page: page,
      limit: limit,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [postRoleStatusApi, { isLoading }] = usePostRoleStatusApiMutation();

  const dispatch = useDispatch();

  const onArchiveRestoreHandler = async (id) => {
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
            const result = await postRoleStatusApi({
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
    const { id, role_name, access_permission } = props;
    setUpdateRole({
      status: true,
      action: "updateRole",
      id: id,
      role_name: role_name,
      access_permission: access_permission,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateRole({
      status: false,
      id: null,
      role_name: "",
      access_permission: null,
    });
  };

  // const onStatusChangeHandler = (status) => {
  //   if (status) setStatus("deactivated");
  //   else setStatus("active");
  // };

  const onViewRoleHandler = (props) => {
    const { id, role_name, access_permission } = props;
    setUpdateRole({
      status: true,
      action: "view",
      id: id,
      role_name: role_name,
      access_permission: access_permission,
    });
  };

  const handleViewRole = (data) => {
    onViewRoleHandler(data);
    dispatch(openDrawer());
    dispatch(closeConfirm());
  };

  const onSetPage = () => {
    setPage(1);
  };

  return (
    <Box className="mcontainer">
      <Typography
        className="mcontainer__title"
        sx={{ fontFamily: "Anton", fontSize: "2rem" }}
      >
        Role Management
      </Typography>

      {roleLoading && <MasterlistSkeleton />}

      {roleError && <ErrorFetching refetch={refetch} />}

      {roleSuccess && (
        <Box className="mcontainer__wrapper">
          <MasterlistToolbar
            path="#"
            onStatusChange={setStatus}
            onSearchChange={setSearch}
            onSetPage={setPage}
          />

          <Box>
            <TableContainer className="mcontainer__th-body">
              <Table className="mcontainer__table" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell className="mcontainer__th-cell mcontainer__text-center">
                      Id
                    </TableCell>

                    <TableCell className="mcontainer__th-cell">Role</TableCell>

                    <TableCell className="mcontainer__th-cell mcontainer__text-center">
                      Access Permission
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
                  {roleSuccess &&
                    roleData.data.map((data) => {
                      return (
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
                            {data.role_name}
                          </TableCell>

                          <TableCell className="mcontainer__tr-cell mcontainer__text-center">
                            <Button
                              sx={{
                                textTransform: "capitalize",
                                textDecoration: "underline",
                              }}
                              variant="text"
                              size="small"
                              color="link"
                              onClick={() => handleViewRole(data)}
                            >
                              View
                            </Button>
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
                      );
                    })}
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
                { label: "All", value: parseInt(roleData?.total) },
              ]}
              component="div"
              count={roleSuccess ? roleData.total : 0}
              page={roleSuccess ? roleData.current_page - 1 : 0}
              rowsPerPage={roleSuccess ? parseInt(roleData?.per_page) : 5}
              onPageChange={pageHandler}
              onRowsPerPageChange={limitHandler}
            />
          </Box>
        </Box>
      )}
      <Dialog open={drawer} PaperProps={{ sx: { borderRadius: "10px" } }}>
        <AddRole
          data={updateRole}
          onUpdateResetHandler={onUpdateResetHandler}
        />
      </Dialog>
    </Box>
  );
};

export default Role;
