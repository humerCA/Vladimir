import React, { useEffect, useState } from "react";
import CustomTextField from "../../../Components/Reusable/CustomTextField";

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
import { LoadingButton } from "@mui/lab";

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
    {
      data: postData,
      isLoading,
      isLoading: isPostLoading,
      isSuccess: isPostSuccess,
      isError: isPostError,
      error: postError,
    },
  ] = usePostRoleApiMutation();

  const [
    updateRole,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      data: updateData,
      isError: isUpdateError,
      error: updateError,
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
  // console.log(watch("access_permission").length);
  // console.log(watch("access_permission"));

  useEffect(() => {
    if (
      (isPostError || isUpdateError) &&
      (postError?.status === 422 || updateError?.status === 422)
    ) {
      setError("role_name", {
        type: "validate",
        message:
          postError?.data?.errors.role_name ||
          updateError?.data?.errors.role_name,
      });
    } else if (
      (isPostError && postError?.status !== 422) ||
      (isUpdateError && updateError?.status !== 422)
    ) {
      dispatch(
        openToast({
          message: "Something went wrong. Please try again.",
          duration: 5000,
          variant: "error",
        })
      );
    }
  }, [isPostError, isUpdateError]);

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
      setValue("role_name", data.role_name);
      setValue("access_permission", data.access_permission);
      console.log(data);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
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

  const Children = () => {
    return (
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
          <FormControlLabel
            disabled={data.action === "view"}
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
            disabled={data.action === "view"}
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
            disabled={data.action === "view"}
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
            disabled={data.action === "view"}
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
            disabled={data.action === "view"}
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
            disabled={data.action === "view"}
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
            disabled={data.action === "view"}
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
            disabled={data.action === "view"}
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
            disabled={data.action === "view"}
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
        {!data.status
          ? "Add Role"
          : data.action === "view"
          ? "View Role"
          : "Edit Role"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="add-masterlist__content"
      >
        <CustomTextField
          required
          control={control}
          disabled={data.action === "view"}
          name="role_name"
          label="Role Name"
          type="text"
          color="secondary"
          size="small"
          error={!!errors?.role_name?.message}
          helperText={errors?.role_name?.message}
          fullWidth
        />

        <Box>
          <FormControlLabel
            sx={data.action === "view" ? { display: "none" } : null}
            label={
              !data.status
                ? "Select Role"
                : data.action === "view"
                ? "Selected Role"
                : "Select Roles"
            }
            disabled={data.action === "view"}
            control={
              <Checkbox
                checked={watch("access_permission")?.length === 9}
                indeterminate={
                  watch("access_permission")?.length >= 1 &&
                  watch("access_permission")?.length <= 8
                }
                // checked={watch("access_permission")?.length === 9}
                // indeterminate={
                //   watch("access_permission")?.length >= 1 &&
                //   watch("access_permission")?.length <= 8
                // }
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
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isUpdateLoading || isPostLoading}
            disabled={
              (errors?.role_name ? true : false) ||
              watch("role_name") === undefined ||
              watch("role_name") === "" ||
              watch("access_permission")?.length === 0 ||
              data.action === "view"
            }
            sx={data.action === "view" ? { display: "none" } : null}
          >
            {!data.status ? "Create" : "Update"}
          </LoadingButton>

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleCloseDrawer}
          >
            {!data.status
              ? "Cancel"
              : data.action === "view"
              ? "Close"
              : "Cancel"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddRole;
