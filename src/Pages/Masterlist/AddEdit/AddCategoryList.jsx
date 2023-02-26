import React, { useEffect, useState } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, TextField, Typography } from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/drawerSlice";
import { useDispatch } from "react-redux";
import {
  usePostCategoryListApiMutation,
  useUpdateCategoryListApiMutation,
} from "../../../Redux/Query/Category/CategoryList";
import { useGetServiceProviderAllApiQuery } from "../../../Redux/Query/ServiceProviderApi";
import { useGetMajorCategoryAllApiQuery } from "../../../Redux/Query/Category/MajorCategory";
import { useGetMinorCategoryAllApiQuery } from "../../../Redux/Query/Category/MinorCategory";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";

const schema = yup.object().shape({
  id: yup.string().nullable(),
  service_provider_id: yup.object().required(),
  major_category_id: yup.object().required(),
  minor_category_id: yup.array().required(),
});

const AddCategoryList = (props) => {
  const { data, onUpdateResetHandler } = props;
  const dispatch = useDispatch();

  const [
    postCategoryList,
    {
      data: postData,
      isLoading: isPostLoading,
      isSuccess: isPostSuccess,
      isError: isPostError,
      error: postError,
    },
  ] = usePostCategoryListApiMutation();

  const [
    updateCategoryList,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      data: updateData,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateCategoryListApiMutation();

  const {
    data: serviceProviderData = [],
    isLoading: isServiceProviderLoading,
    isError: isServiceProviderError,
  } = useGetServiceProviderAllApiQuery();
  // console.log(serviceProviderData);

  const {
    data: majorCategoryData = [],
    isLoading: isMajorCategoryLoading,
    isError: isMajorCategoryError,
  } = useGetMajorCategoryAllApiQuery();

  const {
    data: minorCategoryData = [],
    isLoading: isMinorCategoryLoading,
    isError: isMinorCategoryError,
  } = useGetMinorCategoryAllApiQuery();

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
      service_provider_id: null,
      major_category_id: null,
      minor_category_id: [],
    },
  });

  useEffect(() => {
    if (
      (isPostError || isUpdateError) &&
      (postError?.status === 422 || updateError?.status === 422)
    ) {
      setError("service_provider_id", {
        type: "validate",
        message:
          postError?.data?.errors.categorylist ||
          updateError?.data?.errors.categorylist,
      }) ||
        setError("major_category_id", {
          type: "validate",
          message:
            postError?.data?.errors.categorylist ||
            updateError?.data?.errors.categorylist,
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
      setValue("service_provider_id", data.service_provider_id);
      setValue("major_category_id", data.major_category_id);
      setValue("minor_category_id", data.minor_category_id);
      // console.log(data);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    const newFormData = {
      id: formData.id,
      service_provider_id: formData.service_provider_id?.id,
      major_category_id: formData.major_category_id?.id,
      minor_category_id: formData.minor_category_id.map((item) => {
        return item.id;
      }),
    };

    if (data.status) {
      return updateCategoryList(newFormData);
    }

    postCategoryList(newFormData);
  };

  const handleCloseDrawer = () => {
    setTimeout(() => {
      onUpdateResetHandler();
    }, 500);

    dispatch(closeDrawer());
  };

  return (
    <Box className="add-masterlist">
      <Typography
        color="secondary.main"
        sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}
      >
        {!data.status
          ? "Add Category"
          : data.action === "addMinor"
          ? "Add Minor Category"
          : "Update Category"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="add-masterlist__content"
      >
        <CustomAutoComplete
          required
          includeInputInList
          name="service_provider_id"
          disabled={data.action === "addMinor"}
          control={control}
          options={serviceProviderData}
          loading={isServiceProviderLoading}
          getOptionLabel={(option) => option.service_provider_name}
          isOptionEqualToValue={(option, value) =>
            option.service_provider_name === value.service_provider_name
          }
          size="small"
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              label={
                <>
                  Service Provider <span style={{ color: "red" }}>*</span>
                </>
              }
              sx={{
                ".MuiInputBase-root": { borderRadius: "12px" },
              }}
              error={!!errors?.service_provider_id?.message}
              helperText={errors?.service_provider_id?.message}
            />
          )}
        />

        <CustomAutoComplete
          autoComplete
          name="major_category_id"
          disabled={data.action === "addMinor"}
          control={control}
          options={majorCategoryData}
          loading={isMajorCategoryLoading}
          size="small"
          getOptionLabel={(option) => option.major_category_name}
          isOptionEqualToValue={(option, value) =>
            option.major_category_name === value.major_category_name
          }
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              label={
                <>
                  Major Category <span style={{ color: "red" }}>*</span>
                </>
              }
              sx={{
                ".MuiInputBase-root": { borderRadius: "12px" },
              }}
              error={!!errors?.major_category_id?.message}
              helperText={errors?.major_category_id?.message}
            />
          )}
        />

        <CustomAutoComplete
          autoComplete
          name="minor_category_id"
          disabled={data.action === "updateCategory"}
          control={control}
          options={minorCategoryData}
          size="small"
          getOptionLabel={(option) => option.minor_category_name}
          isOptionEqualToValue={(option, value) =>
            option.minor_category_name === value.minor_category_name
          }
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              label={
                <>
                  Minor Category <span style={{ color: "red" }}>*</span>
                </>
              }
              sx={{
                ".MuiInputBase-root": { borderRadius: "12px" },
              }}
              error={!!errors?.minor_category_id?.message}
              helperText={errors?.minor_category_id?.message}
            />
          )}
          multiple
        />

        <Box className="add-masterlist__buttons">
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isUpdateLoading || isPostLoading}
            disabled={
              (errors?.service_provider_id ? true : false) ||
              watch("service_provider_id") === null ||
              (errors?.major_category_id ? true : false) ||
              watch("major_category_id") === null ||
              (errors?.minor_category_id ? true : false) ||
              watch("minor_category_id").length === 0
            }
          >
            {!data.status
              ? "Create"
              : data.action === "addMinor"
              ? "Add"
              : "Update"}
          </LoadingButton>

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

export default AddCategoryList;
