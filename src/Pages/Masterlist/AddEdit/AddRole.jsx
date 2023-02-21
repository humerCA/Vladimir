import React, { useEffect, useState } from "react";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomPatternfield from "../../../Components/Reusable/CustomPatternfield";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/drawerSlice";
import { useDispatch } from "react-redux";
import {
  usePostRoleApiMutation,
  useUpdateRoleApiMutation,
} from "../../../Redux/Query/RoleManagementApi";
import { openToast } from "../../../Redux/StateManagement/toastSlice";

const schema = yup.object().shape({
  id: yup.string(),
  role_name: yup.string().required(),
  access_permission: yup.array().required(),
});

const AddRole = (props) => {
  const { data, onUpdateResetHandler } = props;

  const dispatch = useDispatch();

  const [
    postRole,
    { isLoading, isSuccess: isPostSuccess, data: postData, isError },
  ] = usePostRoleApiMutation();

  const [
    updateRole,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      data: updateData,
      isError: isUpdateError,
    },
  ] = useUpdateRoleApiMutation();

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setError,
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role_name: "",
      access_permission: [],
    },
  });
  console.log(watch("access_permission"));

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
      setValue("id", data.id);
      setValue("role_name", data.role_name);
      setValue("access_permission", data.access_permission);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      setTimeout(() => {
        onUpdateResetHandler();
      }, 500);
      updateRole(formData);
      return;
    }
    postRole(formData);
  };

  const handleCloseDrawer = () => {
    setTimeout(() => {
      onUpdateResetHandler();
    }, 500);

    dispatch(closeDrawer());
  };

  // const parent = (event) => {
  //   setChecked([event.target.checked, event.target.checked]);
  // };

  const Children = () => {
    return (
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
          <FormControlLabel
            label="Dashboard"
            control={
              <Checkbox
                {...register("access_permission")}
                value="dashboard"
                checked={watch("access_permission")?.includes("dashboard")}
              />
            }
          />

          <FormControlLabel
            label="Masterlist"
            value="masterlist"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("masterlist")}
              />
            }
          />

          <FormControlLabel
            label="Role Management"
            value="role-management"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes(
                  "role-management"
                )}
              />
            }
          />

          <FormControlLabel
            label="Asset for Tagging"
            value="asset-for-tagging"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes(
                  "asset-for-tagging"
                )}
              />
            }
          />

          <FormControlLabel
            label="Asset List"
            value="asset-list"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("asset-list")}
              />
            }
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
          <FormControlLabel
            label="Request"
            value="request"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("request")}
              />
            }
          />
          <FormControlLabel
            label="On Hand"
            value="on-hand"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("on-hand")}
              />
            }
          />
          <FormControlLabel
            label="Disposal"
            value="disposal"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("disposal")}
              />
            }
          />
          <FormControlLabel
            label="Reports"
            value="reports"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("reports")}
              />
            }
          />
        </Box>
      </Box>
    );
  };

  return (
    <Box className="add-masterlist">
      <Typography
        color="secondary.main"
        sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}
      >
        {data.status ? "Edit Role" : "Add Role"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="add-masterlist__content"
      >
        <CustomTextField
          required
          control={control}
          name="role_name"
          label="Role Name"
          type="text"
          color="secondary"
          size="small"
          error={errors?.role_name?.message}
          helperText={errors?.role_name?.message}
          fullWidth
        />
        <Box>
          <FormControlLabel
            label="Select Role"
            control={
              <Checkbox
                checked={watch("access_permission")?.length === 9}
                indeterminate={
                  watch("access_permission")?.length >= 1 &&
                  watch("access_permission")?.length <= 8
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setValue("access_permission", [
                      "dashboard",
                      "masterlist",
                      "role-management",
                      "asset-for-tagging",
                      "asset-list",
                      "request",
                      "on-hand",
                      "disposal",
                      "reports",
                    ]);
                  } else {
                    setValue("access_permission", []);
                  }
                }}
              />
            }
          />
          <Children />
        </Box>

        <Box className="add-masterlist__buttons">
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={
              (errors?.role_name ? true : false) ||
              watch("role_name") === undefined ||
              watch("role_name") === "" ||
              watch("access_permission")?.length === 0
            }
          >
            {data.status ? "Update" : "Create"}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleCloseDrawer}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddRole;
