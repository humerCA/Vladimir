import React, { useState } from "react";
import "../Style/login.scss";
import { vladimirAPI } from "../Api/vladimirAPI";
import CustomTextField from "../Components/Reusable/CustomTextField";
import VladimirLogo1 from "../Img/VladimirLogo1.svg";
import MisLogo from "../Img/MIS LOGO.png";

import { addUserDetails } from "../Redux/StateManagement/userLogin";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import { Box, Button, Typography } from "@mui/material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().required(),
});

const LandingPage = () => {
  const [loginErr, setLoginErr] = useState(null);

  const Login = useNavigate();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // console.log(watch("username"));
  // console.log(watch("password"));

  const onSubmitHandler = async (data) => {
    try {
      const res = await vladimirAPI.post("/auth/login", data);
      console.log(res.data);
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));

      // dispatch(addToken(res.data.data.token));
      dispatch(addUserDetails(res.data.data));

      Login("/");
      reset();
    } catch (err) {
      setLoginErr(err.response.data.message);
      setTimeout(() => {
        setLoginErr(null);
      }, 4000);
      console.log(err.message);
      setError(err.response.data.message);
    }
  };

  return (
    <Box className="login">
      <Box className="login__container">
        <Box className="login__logo-container">
          <Box
            className="login__logo"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <img src={VladimirLogo1} alt="Vladimir" width="40%" />
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Gill Sans MT",
                letterSpacing: "5px",
                color: "white",
              }}
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
          {loginErr && <p className="login__error-message">{loginErr}</p>}
          <Box className="login__form-logo">
            <Box>
              <img
                src={VladimirLogo1}
                alt="Vladimir Logo"
                style={{
                  width: "50px",
                }}
              />
            </Box>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontFamily: "Anton",
              letterSpacing: "5px",
              color: "secondary",
            }}
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
              error={errors?.username?.message}
              helperText={errors?.username?.message}
            />

            <CustomTextField
              required
              control={control}
              name="password"
              label="Password"
              type="password"
              size="small"
              color="secondary"
              error={errors?.password?.message}
              helperText={errors?.password?.message}
            />

            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "10px",
                fontWeight: "bold",
                marginTop: "10px",
              }}
              type="submit"
              fullWidth
            >
              Submit
            </Button>
          </Box>

          <Box className="login__copyright">
            <img src={MisLogo} alt="" width="50px" />
            <p>
              Powered By MIS All rights reserved <br />
              Copyrights © 2021
            </p>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
