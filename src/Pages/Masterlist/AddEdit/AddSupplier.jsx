import React, { useEffect } from "react";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import Numberfield from "../../../Components/Reusable/CustomNumberField";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, Typography } from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/drawerSlice";
import { useDispatch } from "react-redux";
import {
  usePostSupplierApiMutation,
  useUpdateSupplierApiMutation,
} from "../../../Redux/Query/SupplierApi";

const schema = yup.object().shape({
  id: yup.string(),
  supplier_name: yup.string().required(),
  address: yup.string().required(),
  contact_no: yup.string().required(),
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
      contact_no: "",
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
      setValue("supplier_name", data.supplier_name);
      setValue("address", data.address);
      setValue("contact_no", data.contact_no);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      setTimeout(() => {
        onUpdateResetHandler();
      }, 500);
      updateSupplier(formData);
      return;
    }
    postSupplier(formData);
    console.log(formData);
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
          error={errors.supplier_name?.message}
          helperText={errors.supplier_name?.message}
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
          error={errors.address?.message}
          helperText={errors.address?.message}
          fullWidth
        />

        <CustomTextField
          required
          control={control}
          name="contact_no"
          label="Contact Number"
          type="text"
          color="secondary"
          size="small"
          error={errors.contact_no?.message}
          helperText={errors.contact_no?.message}
          fullWidth
        />

        {/* <Numberfield
          required
          control={control}
          name="contact_no"
          label="Contact Number"
          type="number"
          color="secondary"
          size="small"
          error={errors.contact_no?.message}
          helperText={errors.contact_no?.message}
          fullWidth
        /> */}

        <Box className="add-masterlist__buttons">
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={
              (errors.supplier_name ? true : false) ||
              watch("supplier_name") === undefined ||
              watch("supplier_name") === "" ||
              (errors.address ? true : false) ||
              watch("address") === undefined ||
              watch("address") === "" ||
              (errors.contact_no ? true : false) ||
              watch("contact_no") === undefined ||
              watch("contact_no") === ""
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

export default AddSupplier;
