import React, { useEffect, useState } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/drawerSlice";
import { useDispatch } from "react-redux";
import {
  usePostMinorCategoryApiMutation,
  useUpdateMinorCategoryApiMutation,
} from "../../../Redux/Query/Category/MinorCategory";
import { openToast } from "../../../Redux/StateManagement/toastSlice";

const schema = yup.object().shape({
  id: yup.string(),
  minor_category_name: yup.string().required(),
  urgency_level: yup.string().required(),
  personally_assign: yup.boolean().required(),
  evaluate_in_every_movement: yup.boolean().required(),
});

const AddMinorCategory = (props) => {
  const { data, onUpdateResetHandler } = props;
  const dispatch = useDispatch();

  const [
    postMinorCategory,
    { isLoading, isSuccess: isPostSuccess, data: postData, isError },
  ] = usePostMinorCategoryApiMutation();

  const [
    updateMinorCategory,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      data: updateData,
      isError: isUpdateError,
    },
  ] = useUpdateMinorCategoryApiMutation();

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
      minor_category_name: "",
      urgency_level: null,
      personally_assign: null,
      evaluate_in_every_movement: null,
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
      setValue("minor_category_name", data.minor_category_name);
      setValue("urgency_level", data.urgency_level);
      setValue("personally_assign", data.personally_assign);
      setValue("evaluate_in_every_movement", data.evaluate_in_every_movement);
    }
  }, [data]);

  // console.log(data);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      setTimeout(() => {
        onUpdateResetHandler();
      }, 500);
      updateMinorCategory(formData);
      return;
    }
    postMinorCategory(formData);
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
        {data.status ? "Edit Minor Category" : "Add Minor Category"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="add-masterlist__content"
      >
        <CustomTextField
          control={control}
          name="minor_category_name"
          label={
            <>
              Minor Category Name <span style={{ color: "red" }}>*</span>
            </>
          }
          type="text"
          color="secondary"
          size="small"
          error={errors?.minor_category_name?.message}
          helperText={errors?.minor_category_name?.message}
          fullWidth
        />

        <CustomAutoComplete
          autoComplete
          name="urgency_level"
          control={control}
          options={["HIGH", "MEDIUM", "LOW"]}
          size="small"
          isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              label={
                <>
                  Urgency Level <span style={{ color: "red" }}>*</span>
                </>
              }
              sx={{
                ".MuiInputBase-root": { borderRadius: "12px" },
              }}
              error={errors?.urgency_level?.message}
              helperText={errors?.urgency_level?.message}
            />
          )}
          disablePortal
        />

        <Controller
          name="personally_assign"
          control={control}
          render={({ field }) => {
            return (
              <FormControl>
                <FormLabel>Personally Assigned?</FormLabel>

                <RadioGroup {...field}>
                  <FormControlLabel
                    value="1"
                    control={<Radio size="small" />}
                    label="Yes"
                  />

                  <FormControlLabel
                    value="0"
                    control={<Radio size="small" />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            );
          }}
        />

        <Controller
          name="evaluate_in_every_movement"
          control={control}
          render={({ field }) => {
            return (
              <FormControl>
                <FormLabel>Evaluate in every movement?</FormLabel>

                <RadioGroup {...field}>
                  <FormControlLabel
                    value="1"
                    control={<Radio size="small" />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="0"
                    control={<Radio size="small" />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            );
          }}
        />

        <Box className="add-masterlist__buttons">
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={
              (errors?.minor_category_name ? true : false) ||
              watch("minor_category_name") === undefined ||
              watch("minor_category_name") === "" ||
              (errors?.urgency_level ? true : false) ||
              watch("urgency_level") === undefined ||
              watch("urgency_level") === "" ||
              (errors?.personally_assign ? 1 : 0) ||
              watch("personally_assign") === null ||
              (errors?.evaluate_in_every_movement ? 1 : 0) ||
              watch("evaluate_in_every_movement") === null
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

export default AddMinorCategory;
