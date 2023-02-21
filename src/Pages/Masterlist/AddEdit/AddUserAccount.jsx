import React, { useEffect, useState } from "react";
import "../../../Style/Masterlist/addUserAccount.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowBackIosNewRounded } from "@mui/icons-material";
import { createFilterOptions } from "@mui/material/Autocomplete";

import { closeDrawer } from "../../../Redux/StateManagement/drawerSlice";
import { useDispatch } from "react-redux";
import {
  usePostUserApiMutation,
  useUpdateUserApiMutation,
} from "../../../Redux/Query/UserAccountsApi";
import { useGetSedarUsersApiQuery } from "../../../Redux/Query/SedarUserApi";
import { openToast } from "../../../Redux/StateManagement/toastSlice";

const schema = yup.object().shape({
  employee_id: yup.string().required(),
  sedar_employee: yup
    .object()
    .typeError("Employee ID is a required field")
    .required(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  department: yup.string().required(),
  position: yup.string().required(),
  username: yup.string().required().label("Username"),
  user_permission: yup.string().required().label("User permission"),
});

const AddUserAccount = (props) => {
  const { data, onUpdateResetHandler } = props;
  const dispatch = useDispatch();

  const [
    postUser,
    { isLoading, isSuccess: isPostSuccess, data: postData, isError },
  ] = usePostUserApiMutation();

  const [
    updateUser,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      data: updateData,
      isError: isUpdateError,
    },
  ] = useUpdateUserApiMutation();

  const {
    data: sedarData = [],
    isLoading: isSedarLoading,
    isError: isSedarError,
  } = useGetSedarUsersApiQuery();
  console.log(sedarData);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      sedar_employee: null,
      employee_id: "",
      first_name: "",
      last_name: "",
      department: "",
      position: "",
      username: "",
      role_id: 1,
      user_permission: "",
    },
  });

  useEffect(() => {
    if (isPostSuccess) {
      reset();
      handleCloseDrawer();
      dispatch(
        openToast({
          message: postData.message,
          duration: 5000,
        })
      );
    } else if (isUpdateSuccess) {
      reset();
      handleCloseDrawer();
      dispatch(
        openToast({
          message: updateData.message,
          duration: 5000,
        })
      );
    }
  }, [isPostSuccess, isUpdateSuccess]);

  useEffect(() => {
    if (data.status) {
      setValue("employee_id", data.employee_id);
      setValue("first_name", data.first_name);
      setValue("last_name", data.last_name);
      setValue("department", data.department);
      setValue("position", data.position);
      setValue("username", data.username);
      setValue("role_id", data.role_id);
      setValue("user_permission", data.user_permission);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      setTimeout(() => {
        onUpdateResetHandler();
      }, 500);
      updateUser(formData);
      return;
    }
    const obj = {
      ...formData,
      password: formData.username,
    };
    postModule(obj);
  };

  const handleCloseDrawer = () => {
    setTimeout(() => {
      onUpdateResetHandler();
    }, 500);

    dispatch(closeDrawer());
  };

  const filterOptions = createFilterOptions({
    limit: 100,
    matchFrom: "any",
  });

  return (
    <Box className="add-userAccount">
      <Box className="add-userAccount__title">
        <IconButton
          className="add-userAccount__back"
          onClick={handleCloseDrawer}
        >
          <ArrowBackIosNewRounded color="secondary" />
        </IconButton>

        <Typography
          color="secondary.main"
          sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}
        >
          {data.status ? "EDIT USER" : "ADD USER"}
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="add-userAccount__wrapper"
      >
        <Box className="add-userAccount__employee">
          <Typography
            color="secondary.main"
            sx={{ fontFamily: "Anton", fontSize: "1rem" }}
          >
            EMPLOYEE DETAILS
          </Typography>

          <CustomAutoComplete
            required
            includeInputInList
            name="sedar_employee"
            control={control}
            options={sedarData}
            loading={isSedarLoading}
            getOptionLabel={(option) => option.general_info?.full_id_number}
            isOptionEqualToValue={(option, value) =>
              option.general_info?.full_id_number ===
              value.general_info?.full_id_number
            }
            size="small"
            onChange={(_, value) => {
              setValue("employee_id", value.general_info.full_id_number);
              setValue("first_name", value.general_info.first_name);
              setValue("last_name", value.general_info.last_name);
              setValue("department", value.unit_info.department_name);
              setValue("position", value.position_info.position_name);
              return value;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  <>
                    Employee ID <span style={{ color: "red" }}>*</span>
                  </>
                }
                sx={{
                  ".MuiInputBase-root": {
                    borderRadius: "12px",
                    backgroundColor: "white",
                  },
                }}
                color="secondary"
                error={errors?.sedar_employee?.message}
                helperText={errors?.sedar_employee?.message}
              />
            )}
            disablePortal
            filterOptions={filterOptions}
          />

          <CustomTextField
            control={control}
            name="first_name"
            label="Firstname"
            type="text"
            color="secondary"
            size="small"
            fullWidth
            disabled
          />

          <CustomTextField
            control={control}
            name="last_name"
            label="Last Name"
            type="text"
            color="secondary"
            size="small"
            fullWidth
            disabled
          />

          <CustomTextField
            control={control}
            name="department"
            label="Department"
            type="text"
            color="secondary"
            size="small"
            fullWidth
            disabled
          />

          <CustomTextField
            control={control}
            name="position"
            label="Position"
            type="text"
            color="secondary"
            size="small"
            fullWidth
            disabled
          />

          <Divider sx={{ py: 0.5 }} />

          <Typography
            color="secondary.main"
            sx={{ fontFamily: "Anton", fontSize: "1rem" }}
          >
            USERNAME AND PERMISSION
          </Typography>

          <CustomTextField
            control={control}
            name="username"
            label={
              <>
                Username <span style={{ color: "red" }}>*</span>
              </>
            }
            type="text"
            color="secondary"
            size="small"
            error={errors?.username?.message}
            helperText={errors?.username?.message}
            fullWidth
          />

          <CustomAutoComplete
            autoComplete
            name="user_permission"
            control={control}
            options={["Fixed Asset", "Warehouse", "H&M"]}
            size="small"
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label={
                  <>
                    User Peremission <span style={{ color: "red" }}>*</span>
                  </>
                }
                sx={{
                  backgroundColor: "white",
                  ".MuiInputBase-root": { borderRadius: "12px" },
                }}
                error={errors?.user_permission?.message}
                helperText={errors?.user_permission?.message}
              />
            )}
            disablePortal
          />

          <Box className="add-userAccount__buttons">
            <Button size="small" type="submit" variant="contained">
              {data.status ? "Update" : "Create"}
            </Button>

            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={handleCloseDrawer}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddUserAccount;
