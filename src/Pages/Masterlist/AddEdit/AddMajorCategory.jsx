import React, { useEffect, useState } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, Paper, TextField, Typography } from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/drawerSlice";
import { useDispatch } from "react-redux";
import {
  usePostMajorCategoryApiMutation,
  useUpdateMajorCategoryApiMutation,
} from "../../../Redux/Query/Category/MajorCategory";

const schema = yup.object().shape({
  id: yup.string(),
  major_category_name: yup.string().required(),
  classification: yup.object().required(),
});

export const classificationOptions = [
  {
    label: "Machinery & Equipment",
    value: "machinery_&_equipment",
  },
  {
    label: "Small Tools",
    value: "small_tools",
  },
  {
    label: "Vehicle",
    value: "vechicle",
  },
  {
    label: "Mobile Phone",
    value: "mobile_phone",
  },
];

const AddMajorCategory = (props) => {
  const { data, onUpdateResetHandler } = props;
  const dispatch = useDispatch();

  const [
    postMajorCategory,
    { isLoading, isSuccess: isPostSuccess, data: postData, isError },
  ] = usePostMajorCategoryApiMutation();

  const [
    updateMajorCategory,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      data: updateData,
      isError: isUpdateError,
    },
  ] = useUpdateMajorCategoryApiMutation();

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
      major_category_name: "",
      classification: null,
    },
  });

  useEffect(() => {
    if (isPostSuccess) {
      reset();
      handleCloseDrawer();
    } else if (isUpdateSuccess) {
      reset();
      handleCloseDrawer();
    }
  }, [isPostSuccess, isUpdateSuccess]);

  useEffect(() => {
    if (data.status) {
      setValue("id", data.id);
      setValue("major_category_name", data.major_category_name);
      setValue(
        "classification",
        classificationOptions.find((item) => item.value === data.classification)
      );
      console.log(data);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    const newFormData = {
      ...formData,
      classification: formData.classification.value,
    };

    if (data.status) {
      setTimeout(() => {
        onUpdateResetHandler();
      }, 500);
      updateMajorCategory(newFormData);
      return;
    }

    postMajorCategory(newFormData);
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
        {data.status ? "Edit Major Category" : "Add Major Category"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="add-masterlist__content"
      >
        <CustomAutoComplete
          autoComplete
          name="classification"
          control={control}
          options={classificationOptions}
          size="small"
          isOptionEqualToValue={(option, value) => option.label === value.label}
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              label={
                <>
                  Classification <span style={{ color: "red" }}>*</span>
                </>
              }
              sx={{
                ".MuiInputBase-root": { borderRadius: "12px" },
              }}
              error={errors.classification?.message}
              helperText={errors.classification?.message}
            />
          )}
          disablePortal
        />

        <CustomTextField
          control={control}
          name="major_category_name"
          label={
            <>
              Major Category Name <span style={{ color: "red" }}>*</span>
            </>
          }
          type="text"
          color="secondary"
          size="small"
          error={errors.major_category_name?.message}
          helperText={errors.major_category_name?.message}
          fullWidth
        />
        <Box className="add-masterlist__buttons">
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={
              (errors.major_category_name ? true : false) ||
              watch("major_category_name") === undefined ||
              watch("major_category_name") === "" ||
              (errors.classification ? true : false) ||
              watch("classification") === undefined ||
              watch("classification") === ""
            }
          >
            Create
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

export default AddMajorCategory;
