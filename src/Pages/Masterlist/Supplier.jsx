import React, { useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../Components/Reusable/ActionMenu";
import AddSupplier from "./AddEdit/AddSupplier";

// RTK
import { useDispatch } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import {
  openConfirm,
  closeConfirm,
} from "../../Redux/StateManagement/confirmSlice";
import {
  usePostSupplierStatusApiMutation,
  useGetSupplierApiQuery,
} from "../../Redux/Query/SupplierApi";

import { useSelector } from "react-redux";

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

const Supplier = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [updateSupplier, setUpdateSupplier] = useState({
    status: false,
    id: null,
    supplier_name: "",
    address: "",
    contact_no: null,
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
    data: supplierData,
    isLoading: supplierLoading,
    isSuccess: supplierSuccess,
    isError: supplierError,
    refetch,
  } = useGetSupplierApiQuery(
    {
      page: page,
      limit: limit,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [postSupplierStatusApi, { isLoading }] =
    usePostSupplierStatusApiMutation();

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
            const result = await postSupplierStatusApi({
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
    const { id, supplier_name, address, contact_no } = props;
    setUpdateSupplier({
      status: true,
      id: id,
      supplier_name: supplier_name,
      address: address,
      contact_no: contact_no,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateSupplier({
      status: false,
      id: null,
      supplier_name: "",
      address: "",
      contact_no: null,
    });
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
        Suppliers
      </Typography>

      {supplierLoading && <MasterlistSkeleton />}

      {supplierError && <ErrorFetching refetch={refetch} />}

      {supplierData && (
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

                    <TableCell className="mcontainer__th-cell">
                      Service Provider
                    </TableCell>

                    <TableCell className="mcontainer__th-cell">
                      Address
                    </TableCell>

                    <TableCell className="mcontainer__th-cell">
                      Contact Number
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
                  {supplierSuccess &&
                    supplierData.data.map((data) => (
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
                          {data.supplier_name}
                        </TableCell>

                        <TableCell className="mcontainer__tr-cell">
                          {data.address}
                        </TableCell>

                        <TableCell className="mcontainer__tr-cell">
                          {data.contact_no}
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
                { label: "All", value: parseInt(supplierData?.total) },
              ]}
              component="div"
              count={supplierSuccess ? supplierData.total : 0}
              page={supplierSuccess ? supplierData.current_page - 1 : 0}
              rowsPerPage={
                supplierSuccess ? parseInt(supplierData?.per_page) : 5
              }
              onPageChange={pageHandler}
              onRowsPerPageChange={limitHandler}
            />
          </Box>
        </Box>
      )}

      <Dialog open={drawer} PaperProps={{ sx: { borderRadius: "10px" } }}>
        <AddSupplier
          data={updateSupplier}
          onUpdateResetHandler={onUpdateResetHandler}
        />
      </Dialog>
    </Box>
  );
};

export default Supplier;
