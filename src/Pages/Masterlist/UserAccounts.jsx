import React, { useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../Components/Reusable/ActionMenu";
import AddUserAccounts from "../../Pages/Masterlist/AddEdit/AddUserAccount";
import * as XLSX from "xlsx";

// RTK
import { useDispatch } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import {
  openConfirm,
  closeConfirm,
} from "../../Redux/StateManagement/confirmSlice";
import {
  usePostUserStatusApiMutation,
  useResetUserApiMutation,
  useGetUserAccountsApiQuery,
} from "../../Redux/Query/UserAccountsApi";
import { useSelector } from "react-redux";

// MUI
import {
  Box,
  Button,
  Drawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Help, IosShareRounded, ReportProblem } from "@mui/icons-material";

const UserAccounts = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [updateUser, setUpdateUser] = useState({
    status: false,
    id: null,
    employee_id: "",
    firstname: "",
    lastname: "",
    department_id: "",
    username: "",
    password: "",
    role_id: 1,
    access_permission: [
      "Dashboard",
      "Masterlist",
      "Asset for Tagging",
      "Asset List",
      "Request",
      "Onhand",
      "Disposal",
      "Reports",
    ],
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
    data: users,
    isLoading: usersLoading,
    isSuccess: usersSuccess,
    isError: usersError,
  } = useGetUserAccountsApiQuery(
    {
      page: page,
      limit: limit,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [postUserStatusApi, { isLoading }] = usePostUserStatusApiMutation();

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
            const result = await postUserStatusApi({
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
    const { id, module_name } = props;
    setUpdateUser({
      status: true,
      id: id,
      module_name: module_name,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateUser({
      status: false,
      id: null,
      module_name: "",
    });
  };

  const onResetHandler = async (id) => {
    dispatch(
      openConfirm({
        icon: status === "active" ? ReportProblem : Help,
        message: (
          <Box>
            <Typography> Are you sure you want to</Typography>
            <Typography
              sx={{ display: "inline-block", color: "secondary.main" }}
            >
              RESET
            </Typography>{" "}
            this user password?
          </Box>
        ),

        onConfirm: async (id) => {
          try {
            const result = await useResetUserApiMutation({
              id: id,
            }).unwrap();

            dispatch(
              openToast({
                message: result.data.message,
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

  const handleExport = () => {
    const workbook = XLSX.utils.book_new(),
      worksheet = XLSX.utils.json_to_sheet(users.data);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Vladimir-UserAccounts.xlsx");
  };

  const onSetPage = () => {
    setPage(1);
  };

  return (
    <Box className="mcontainer">
      <Typography
        sx={{ fontFamily: "Anton", fontSize: "2rem" }}
        className="mcontainer__title"
      >
        User Accounts
      </Typography>

      <Box className="mcontainer__wrapper">
        <MasterlistToolbar
          path="#"
          onStatusChange={setStatus}
          onSearchChange={setSearch}
          onSetPage={setPage}
          onImport={() => {}}
        />

        <Box>
          <TableContainer>
            <Table className="mcontainer__table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell className="mcontainer__th-cell mcontainer__text-center">
                    Id
                  </TableCell>

                  <TableCell className="mcontainer__th-cell">
                    Firstname
                  </TableCell>

                  <TableCell className="mcontainer__th-cell">
                    Lastname
                  </TableCell>

                  <TableCell className="mcontainer__th-cell">
                    Position
                  </TableCell>

                  <TableCell className="mcontainer__th-cell">
                    Username
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
                {usersSuccess &&
                  users.data.map((users) => (
                    <TableRow
                      key={users.id}
                      // sx={{
                      //   "&:last-child td, &:last-child th": {
                      //     borderBottom: 0,
                      //   },
                      // }}
                    >
                      <TableCell className="mcontainer__tr-cell mcontainer__text-center">
                        {users.id}
                      </TableCell>

                      <TableCell className="mcontainer__tr-cell">
                        {users.first_name}
                      </TableCell>

                      <TableCell className="mcontainer__tr-cell">
                        {users.last_name}
                      </TableCell>

                      <TableCell className="mcontainer__tr-cell">
                        {users.position}
                      </TableCell>

                      <TableCell className="mcontainer__tr-cell">
                        {users.username}
                      </TableCell>

                      <TableCell className="mcontainer__tr-cell mcontainer__text-center">
                        {users.is_active ? (
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
                        {Moment(users.created_at).format("MMM DD, YYYY")}
                      </TableCell>

                      <TableCell className="mcontainer__tr-cell mcontainer__text-center ">
                        <ActionMenu
                          status={status}
                          data={users}
                          onArchiveRestoreHandler={onArchiveRestoreHandler}
                          onResetHandler={onResetHandler}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box className="mcontainer__pagination-export">
          <Button
            variant="outlined"
            size="small"
            color="text"
            startIcon={<IosShareRounded color="primary" />}
            onClick={handleExport}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "10px 20px",
            }}
          >
            EXPORT
          </Button>

          <TablePagination
            rowsPerPageOptions={[
              5,
              10,
              15,
              { label: "All", value: parseInt(usersSuccess?.total) },
            ]}
            component="div"
            count={usersSuccess ? users.total : 0}
            page={usersSuccess ? users.current_page - 1 : 0}
            rowsPerPage={usersSuccess ? parseInt(users?.per_page) : 5}
            onPageChange={pageHandler}
            onRowsPerPageChange={limitHandler}
            sx={{ flexWrap: "wrap" }}
          />
        </Box>

        <Drawer
          anchor="right"
          open={drawer}
          onClose={() => {}}
          PaperProps={{
            sx: {
              borderRadius: "10px",
              background: "#eee",
            },
          }}
        >
          <AddUserAccounts data={updateUser} />
        </Drawer>
      </Box>
    </Box>
  );
};

export default UserAccounts;
