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

const schema = yup.object().shape({
  id: yup.string().nullable(),
  service_provider_id: yup.object(),
  major_category_id: yup.object(),
  minor_category_id: yup.array(),
});

const AddCategoryList = (props) => {
  const { data, onUpdateResetHandler } = props;
  const dispatch = useDispatch();

  const [
    postCategoryList,
    { isLoading, isSuccess: isPostSuccess, data: postData, isError },
  ] = usePostCategoryListApiMutation();

  const [
    updateCategoryList,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      data: updateData,
      isError: isUpdateError,
    },
  ] = useUpdateCategoryListApiMutation();

  const {
    data: serviceProviderData = [],
    isLoading: isServiceProviderLoading,
    isError: isServiceProviderError,
  } = useGetServiceProviderAllApiQuery();
  console.log(serviceProviderData);

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
      setTimeout(() => {
        onUpdateResetHandler();
      }, 500);
      updateCategoryList(newFormData);
      return;
    }

    postCategoryList(newFormData);
    console.log(newFormData);
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
        {data.status ? "Edit Category" : "Add Category"}
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
              error={errors?.service_provider_name?.message}
              helperText={errors?.service_provider_name?.message}
            />
          )}
        />

        <CustomAutoComplete
          autoComplete
          name="major_category_id"
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
              error={errors?.major_category_name?.message}
              helperText={errors?.major_category_name?.message}
            />
          )}
        />

        <CustomAutoComplete
          autoComplete
          name="minor_category_id"
          disabled={!!data.status}
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
              error={errors?.minor_category_name?.message}
              helperText={errors?.minor_category_name?.message}
            />
          )}
          multiple
        />

        <Box className="add-masterlist__buttons">
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={
              (errors?.service_provider_id ? true : false) ||
              watch("service_provider_id") === null ||
              (errors?.major_category_id ? true : false) ||
              watch("major_category_id") === null ||
              (errors?.minor_category_id ? true : false) ||
              watch("minor_category_id").length === 0
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

export default AddCategoryList;
