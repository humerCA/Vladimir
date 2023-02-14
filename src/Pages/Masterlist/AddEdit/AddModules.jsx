import React, { useEffect } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, Typography } from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/drawerSlice";
import { useDispatch } from "react-redux";
import {
  usePostModuleApiMutation,
  useUpdateModuleApiMutation,
} from "../../../Redux/Query/ModulesApi";

const schema = yup.object().shape({
  id: yup.string(),
  module_name: yup.string().required(),
});

const AddModules = (props) => {
  const { data, onUpdateResetHandler } = props;
  const dispatch = useDispatch();

  const [
    postModule,
    { isLoading, isSuccess: isPostSuccess, data: postData, isError },
  ] = usePostModuleApiMutation();

  const [
    updateModule,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      data: updateData,
      isError: isUpdateError,
    },
  ] = useUpdateModuleApiMutation();

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
      module_name: "",
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
      setValue("module_name", data.module_name);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      setTimeout(() => {
        onUpdateResetHandler();
      }, 500);
      updateModule(formData);
      return;
    }
    postModule(formData);
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
        {data.status ? "Edit Module" : "Add Module"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="add-masterlist__content"
      >
        <CustomTextField
          required
          control={control}
          name="module_name"
          label="Module Name"
          type="text"
          color="secondary"
          size="small"
          error={errors.module_name?.message}
          helperText={errors.module_name?.message}
          fullWidth
        />
        <Box className="add-masterlist__buttons">
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={
              (errors.module_name ? true : false) ||
              watch("module_name") === undefined ||
              watch("module_name") === ""
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

export default AddModules;
