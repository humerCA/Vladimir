import React, { useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../Components/Reusable/ActionMenu";
import AddCategoryList from "../Masterlist/AddEdit/AddCategoryList";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import {
  closeConfirm,
  openConfirm,
} from "../../Redux/StateManagement/confirmSlice";
import {
  useGetCategoryListApiQuery,
  usePutCategoryListStatusApiMutation,
} from "../../Redux/Query/Category/CategoryList";

// MUI
import {
  Box,
  Dialog,
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
import { Help, ReportProblem } from "@mui/icons-material";

const CategoryList = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [updateCategoryList, setUpdateCategoryList] = useState({
    status: false,
    id: null,
    _category_name: "",
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
    data: categoryListData,
    isLoading: categoryListLoading,
    isSuccess: categoryListSuccess,
    isError: categoryListError,
  } = useGetCategoryListApiQuery(
    {
      page: page,
      limit: limit,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [putCategoryListStatusApi, { isLoading }] =
    usePutCategoryListStatusApiMutation();

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
            const result = await putCategoryListStatusApi({
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
    const { id, category_name, classification } = props;
    setUpdateCategoryList({
      status: true,
      id: id,
      category_name: category_name,
      classification: classification,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateCategoryList({
      status: false,
      id: null,
      category_name: "",
      classification: "",
    });
  };

  const onSetPage = () => {
    setPage(1);
  };

  const classOptions = (classification) => {
    switch (classification) {
      case "machinery_&_equipment":
        return "Machinery & Equipment";

      case "small_tools":
        return "Small Tools";

      case "vechicle":
        return "Vehicle";

      case "mobile_phone":
        return "Mobile Phone";

      default:
        return "invalid classification";
    }
  };
  return (
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
                  Category
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
              {categoryListSuccess &&
                categoryListData.data.map((data) => (
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
                      {data.category_name}
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
              value: parseInt(categoryListData?.total),
            },
          ]}
          component="div"
          count={categoryListSuccess ? categoryListData.total : 0}
          page={categoryListSuccess ? categoryListData.current_page - 1 : 0}
          rowsPerPage={
            categoryListSuccess ? parseInt(categoryListData?.per_page) : 5
          }
          onPageChange={pageHandler}
          onRowsPerPageChange={limitHandler}
        />
      </Box>

      <Drawer anchor="right" open={drawer} onClose={() => {}}>
        <AddCategoryList data={updateCategoryList} />
      </Drawer>
    </Box>
  );
};

export default CategoryList;
