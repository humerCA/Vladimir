import React, { useEffect, useState } from "react";
import "../../../Style/Masterlist/addUserAccount.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowBackIosNewRounded } from "@mui/icons-material";
import { createFilterOptions } from "@mui/material/Autocomplete";

import { closeDrawer } from "../../../Redux/StateManagement/drawerSlice";
import { useDispatch } from "react-redux";
import {
  usePostUserApiMutation,
  useUpdateUserApiMutation,
} from "../../../Redux/Query/UserAccountsApi";
import { useGetSedarUsersApiQuery } from "../../../Redux/Query/SedarUserApi";

const schema = yup.object().shape({
  employee_id: yup.string().required(),
  sedar_employee: yup
    .object()
    .typeError("Employee ID is a required field")
    .required(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  department: yup.string().required(),
  position: yup.string().required(),
  username: yup.string().required().label("Username"),
  role_id: yup.string().required().label("Username"),
  user_permission: yup.string().required().label("User permission"),
});

const AddUserAccount = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const { data, onUpdateResetHandler } = props;
  const dispatch = useDispatch();

  const [
    postModule,
    { isLoading, isSuccess: isPostSuccess, data: postData, isError },
  ] = usePostUserApiMutation();

  const [
    updateModule,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      data: updateData,
      isError: isUpdateError,
    },
  ] = useUpdateUserApiMutation();

  const {
    data: sedarData = [],
    isLoading: isSedarLoading,
    isError: isSedarError,
  } = useGetSedarUsersApiQuery();

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
      service_provider_id: "",
      major_category_id: "",
      minor_category_id: "",
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
      setValue("employee_id", data.employee_id);
      setValue("first_name", data.first_name);
      setValue("last_name", data.last_name);
      setValue("department", data.department);
      setValue("position", data.position);
      setValue("username", data.username);
      setValue("role_id", data.role_id);
      setValue("user_permission", data.user_permission);
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
    const obj = {
      ...formData,
      password: formData.username,
    };
    postModule(obj);
  };

  const handleCloseDrawer = () => {
    setTimeout(() => {
      onUpdateResetHandler();
    }, 500);

    dispatch(closeDrawer());
  };

  const filterOptions = createFilterOptions({
    limit: 100,
    matchFrom: "any",
  });

  return (
    <Box className="add-userAccount">
      <Box className="add-userAccount__title">
        <IconButton
          className="add-userAccount__back"
          onClick={handleCloseDrawer}
        >
          <ArrowBackIosNewRounded color="secondary" />
        </IconButton>

        <Typography
          color="secondary.main"
          sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}
        >
          {data.status ? "EDIT CATEGORY" : "ADD CATEGORY"}
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="add-userAccount__wrapper"
      >
        <Box className="add-userAccount__employee">
          <Typography
            color="secondary.main"
            sx={{ fontFamily: "Anton", fontSize: "1rem" }}
          >
            CATEGORY
          </Typography>

          <CustomAutoComplete
            autoComplete
            name="major"
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
                  ".MuiInputBase-root": {
                    borderRadius: "12px",
                    background: "white",
                  },
                }}
                error={errors.urgency_level?.message}
                helperText={errors.urgency_level?.message}
              />
            )}
            disablePortal
          />

          <Box className="add-userAccount__buttons">
            <Button size="small" type="submit" variant="contained">
              ADD USER
            </Button>

            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={handleCloseDrawer}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddUserAccount;
