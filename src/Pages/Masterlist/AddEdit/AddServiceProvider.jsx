import React, { useEffect } from "react";
import CustomTextField from "../../../Components/Reusable/CustomTextField";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, Typography } from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/drawerSlice";
import { useDispatch } from "react-redux";
import {
  usePostServiceProviderApiMutation,
  useUpdateServiceProviderApiMutation,
} from "../../../Redux/Query/ServiceProviderApi";

const schema = yup.object().shape({
  id: yup.string(),
  service_provider_name: yup.string().required(),
});

const AddServiceProvider = (props) => {
  const { data, onUpdateResetHandler } = props;
  const dispatch = useDispatch();

  const [
    postServiceProvider,
    { isLoading, isSuccess: isPostSuccess, data: postData, isError },
  ] = usePostServiceProviderApiMutation();

  const [
    updateServiceProvider,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      data: updateData,
      isError: isUpdateError,
    },
  ] = useUpdateServiceProviderApiMutation();

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
      service_provider_name: "",
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
      setValue("service_provider_name", data.service_provider_name);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      setTimeout(() => {
        onUpdateResetHandler();
      }, 500);
      updateServiceProvider(formData);
      return;
    }
    postServiceProvider(formData);
    console.log(data.status);
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
        {data.status ? "Edit Service Provider" : "Add Service Provider"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="add-masterlist__content"
      >
        <CustomTextField
          required
          control={control}
          name="service_provider_name"
          label="Service Provider"
          type="text"
          color="secondary"
          size="small"
          error={errors.service_provider_name?.message}
          helperText={errors.service_provider_name?.message}
          fullWidth
        />
        <Box className="add-masterlist__buttons">
          <Button
            type="submit"
            variant="contained"
            size="small"
            // disabled={
            //   (errors.service_provider_name ? true : false) ||
            //   watch("service_provider_name") === undefined ||
            //   watch("service_provider_name") === ""
            // }
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

export default AddServiceProvider;
