import React from "react";
import "../Style/login.scss";
import { vladimirAPI } from "../Api/vladimirAPI";
import CustomTextField from "../Components/Reusable/CustomTextField";
import VladimirLogo from "../Img/VladimirSmally.png";

import { useNavigate } from "react-router-dom";

import { Box, Button, TextField, Typography } from "@mui/material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const LandingPage = () => {
  // const inputStyle = { WebkitBoxShadow: "0 0 0 1000px transparent inset" };

  const Login = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // console.log(watch("username"));
  // console.log(watch("password"));

  const onSubmitHandler = async (data) => {
    try {
      const res = await vladimirAPI.post("/auth/login", data);
      console.log(res.data);
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("username", res.data.data.user.username);
      localStorage.setItem(
        "department_name",
        res.data.data.user.department.department_name
      );
      Login("/");
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
    reset();
  };

  return (
    <Box className="login">
      <Box className="login__container">
        <Box className="login__logo">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <img src={VladimirLogo} alt="Vladimir" width="40%" />
            <Typography
              variant="h4"
              sx={{ fontFamily: "Gill Sans MT", letterSpacing: "5px" }}
            >
              VLADIMIR
            </Typography>
          </Box>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          className="login__form"
        >
          <Typography
            variant="h4"
            sx={{ fontFamily: "Anton", letterSpacing: "5px" }}
          >
            LOGIN
          </Typography>

          <Box className="login__text-field">
            <CustomTextField
              required
              control={control}
              name="username"
              // label={
              //   <>
              //     Username <span style={{ color: "red" }}>*</span>
              //   </>
              // }
              label="Username"
              type="text"
              size="small"
              color="secondary"
              error={errors.username?.message}
              helperText={errors.username?.message}
            />

            <CustomTextField
              required
              control={control}
              name="password"
              label="Password"
              type="password"
              size="small"
              color="secondary"
              error={errors.password?.message}
              helperText={errors.password?.message}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            sx={{ width: "200px" }}
            type="submit"
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
