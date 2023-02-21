import React, { useEffect } from "react";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomPatternfield from "../../../Components/Reusable/CustomPatternfield";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, InputAdornment, Typography } from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/drawerSlice";
import { useDispatch } from "react-redux";
import {
  usePostSupplierApiMutation,
  useUpdateSupplierApiMutation,
} from "../../../Redux/Query/SupplierApi";
import { openToast } from "../../../Redux/StateManagement/toastSlice";

const schema = yup.object().shape({
  id: yup.string(),
  supplier_name: yup.string().required(),
  address: yup.string().required(),
  contact_no: yup
    .string()
    .required()
    .typeError("Contact Number is a required field"),
});

const AddSupplier = (props) => {
  const { data, onUpdateResetHandler } = props;
  const dispatch = useDispatch();

  const [
    postSupplier,
    { isLoading, isSuccess: isPostSuccess, data: postData, isError },
  ] = usePostSupplierApiMutation();

  const [
    updateSupplier,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      data: updateData,
      isError: isUpdateError,
    },
  ] = useUpdateSupplierApiMutation();

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
      supplier_name: "",
      address: "",
      contact_no: null,
    },
  });

  // console.log(watch("contact_no"));

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
      const contact = data.contact_no.slice(2);
      setValue("id", data.id);
      setValue("supplier_name", data.supplier_name);
      setValue("address", data.address);
      setValue("contact_no", contact);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      setTimeout(() => {
        onUpdateResetHandler();
      }, 500);
      const newObj = { ...formData, contact_no: "09" + formData.contact_no };
      updateSupplier(newObj);
      console.log(data);

      return;
    }
    if (formData.contact_no) {
      const newObj = { ...formData, contact_no: "09" + formData.contact_no };
      postSupplier(newObj);
    }
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
        {data.status ? "Edit Supplier" : "Add Supplier"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="add-masterlist__content"
      >
        <CustomTextField
          required
          control={control}
          name="supplier_name"
          label="Supplier"
          type="text"
          color="secondary"
          size="small"
          error={errors?.supplier_name?.message}
          helperText={errors?.supplier_name?.message}
          fullWidth
        />
        <CustomTextField
          required
          control={control}
          name="address"
          label="Address"
          type="text"
          color="secondary"
          size="small"
          error={errors?.address?.message}
          helperText={errors?.address?.message}
          fullWidth
        />

        <CustomPatternfield
          required
          control={control}
          name="contact_no"
          label="Contact Number"
          color="secondary"
          type="text"
          size="small"
          error={errors?.contact_no?.message}
          helperText={errors?.contact_no?.message}
          format="(09##) - ### - ####"
          allowEmptyFormatting
          valueIsNumericString
          fullWidth
        />

        <Box className="add-masterlist__buttons">
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={
              (errors?.supplier_name ? true : false) ||
              watch("supplier_name") === undefined ||
              watch("supplier_name") === "" ||
              (errors?.address ? true : false) ||
              watch("address") === undefined ||
              watch("address") === "" ||
              (errors?.contact_no ? true : false) ||
              watch("contact_no") === undefined ||
              watch("contact_no") === null
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

export default AddSupplier;
