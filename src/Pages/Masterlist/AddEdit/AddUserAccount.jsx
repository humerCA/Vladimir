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
import {
  ArrowBackIosNewRounded,
  ArrowForwardIosRounded,
} from "@mui/icons-material";
import { createFilterOptions } from "@mui/material/Autocomplete";

import { closeDrawer } from "../../../Redux/StateManagement/drawerSlice";
import { useDispatch } from "react-redux";
import {
  usePostUserApiMutation,
  useUpdateUserApiMutation,
} from "../../../Redux/Query/UserAccountsApi";
import { useGetSedarUsersApiQuery } from "../../../Redux/Query/SedarUserApi";
import { useGetRoleAllApiQuery } from "../../../Redux/Query/RoleManagementApi";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  employee_id: yup.string().required(),
  sedar_employee: yup
    .object()
    .typeError("Employee ID is a required field")
    .required(),
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  // department: yup.string().required(),
  // position: yup.string().required(),
  username: yup.string().required().label("Username"),
  role_id: yup.object().required().label("User permission"),
});

const AddUserAccount = (props) => {
  const { data, onUpdateResetHandler } = props;
  const dispatch = useDispatch();

  const [
    postUser,
    {
      data: postData,
      isLoading: isPostLoading,
      isSuccess: isPostSuccess,
      isError: isPostError,
      error: postError,
    },
  ] = usePostUserApiMutation();

  const [
    updateUser,
    {
      data: updateData,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
    },
  ] = useUpdateUserApiMutation();

  const {
    data: sedarData = [],
    isLoading: isSedarLoading,
    isSuccess: isSedarSuccess,
    isError: isSedarError,
  } = useGetSedarUsersApiQuery();
  // console.log(sedarData);

  const {
    data: roleData = [],
    isLoading: isRoleLoading,
    isError: isRoleError,
  } = useGetRoleAllApiQuery();
  // console.log(roleData);

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
      id: "",
      sedar_employee: null,
      employee_id: null,
      firstname: "",
      lastname: "",
      // department: "",
      // position: "",
      username: "",
      role_id: null,
    },
  });

  useEffect(() => {
    if (isPostError && postError?.status === 422) {
      setError("sedar_employee", {
        type: "validate",
        message: postError?.data?.errors.employee_id,
      });
    } else if (isPostError && postError?.status !== 422) {
      dispatch(
        openToast({
          message: "Something went wrong. Please try again.",
          duration: 5000,
          variant: "error",
        })
      );
    }
  }, [isPostError]);

  useEffect(() => {
    if (isPostSuccess || isUpdateSuccess) {
      reset();
      handleCloseDrawer();
      dispatch(
        openToast({
          message: postData?.message || updateData?.message,
          duration: 5000,
        })
      );

      setTimeout(() => {
        onUpdateResetHandler();
      }, 500);
    }
  }, [isPostSuccess, isUpdateSuccess]);

  useEffect(() => {
    if (data.status) {
      setValue("id", data.id);
      setValue("employee_id", data.employee_id);
      setValue("sedar_employee", {
        general_info: {
          full_id_number: data.employee_id,
        },
      });
      setValue("firstname", data.firstname);
      setValue("lastname", data.lastname);
      // setValue("department", data.department);
      // setValue("position", data.position);
      setValue("username", data.username);
      setValue("role_id", data.role);
    }
    // console.log(data);
  }, [data]);
  console.log(watch("employee_id"));

  const onSubmitHandler = (formData) => {
    const newFormData = {
      id: formData.id,
      employee_id: formData.employee_id,
      firstname: formData.firstname,
      lastname: formData.lastname,
      username: formData.username,
      role_id: formData.role_id?.id,
    };

    if (data.status) {
      return updateUser(newFormData);
    }

    const obj = {
      ...newFormData,
      password: newFormData.username,
    };
    postUser(obj);
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
          <ArrowForwardIosRounded color="secondary" />
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
            name="sedar_employee"
            control={control}
            size="small"
            disabled={!!data.status}
            required
            includeInputInList
            disablePortal
            filterOptions={filterOptions}
            options={sedarData}
            loading={isSedarLoading}
            getOptionLabel={(option) => option.general_info?.full_id_number}
            isOptionEqualToValue={(option, value) =>
              option.general_info?.full_id_number ===
              value.general_info?.full_id_number
            }
            onChange={(_, value) => {
              setValue("employee_id", value.general_info?.full_id_number);
              setValue("firstname", value.general_info?.first_name);
              setValue("lastname", value.general_info?.last_name);
              // setValue("department", value.unit_info.department_name);
              // setValue("position", value.position_info.position_name);
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
                error={!!errors?.sedar_employee?.message}
                helperText={errors?.sedar_employee?.message}
              />
            )}
          />

          <CustomTextField
            control={control}
            name="firstname"
            label="Firstname"
            type="text"
            color="secondary"
            size="small"
            fullWidth
            disabled
          />

          <CustomTextField
            control={control}
            name="lastname"
            label="Last Name"
            type="text"
            color="secondary"
            size="small"
            fullWidth
            disabled
          />

          {/* <CustomTextField
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
          /> */}

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
            error={!!errors?.username?.message}
            helperText={errors?.username?.message}
            fullWidth
          />

          <CustomAutoComplete
            autoComplete
            name="role_id"
            control={control}
            options={roleData}
            loading={isRoleLoading}
            size="small"
            getOptionLabel={(option) => option.role_name}
            isOptionEqualToValue={(option, value) =>
              option.role_name === value.role_name
            }
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label={
                  <>
                    User Permission <span style={{ color: "red" }}>*</span>
                  </>
                }
                sx={{
                  backgroundColor: "white",
                  ".MuiInputBase-root": { borderRadius: "12px" },
                }}
                error={!!errors?.role_id?.message}
                helperText={errors?.role_id?.message}
              />
            )}
            disablePortal
          />

          <Box className="add-userAccount__buttons">
            <LoadingButton
              type="submit"
              variant="contained"
              size="small"
              loading={isUpdateLoading || isPostLoading}
            >
              {data.status ? "Update" : "Create"}
            </LoadingButton>

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
