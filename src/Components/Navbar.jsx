import React, { useState } from "react";
import "../Style/navbar.scss";
import PropTypes from "prop-types";
import {
  Link as RouterLink,
  Route,
  Routes,
  MemoryRouter,
  useLocation,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../Redux/StateManagement/sidebar";

import { MenuRounded, ArrowBackIosRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";

const breadcrumbNameMap = {
  "/masterlist": "Masterlist",
  "/masterlist/user-accounts": "User Accounts",
  "/masterlist/service-provider": "Service Provider",
  "/masterlist/category": "Category",
  "/masterlist/supplier": "Supplier",
  "/masterlist/create-asset-registration": "Create Asset Registration",
  "/asset-for-tagging": "Asset for Tagging",
  "/asset-list": "Asset List",
  "/request": "Request",
  "/request/transfer": "Transfer",
  "/request/pull-out": "Pull Out",
  "/request/evaluation": "Evaluation",
  "/on-hand-in-process": "On Hand in Process",
  "/disposal": "Disposal",
  "/reports": "Reports",
  "/reports/report1": "Report 1",
  "/reports/report2": "Report 2",
  "/reports/report3": "Report 3",
};

function ListItemLink(props) {
  const { to, open, ...other } = props;
  const primary = breadcrumbNameMap[to];

  let icon = null;
  if (open != null) {
    icon = open ? <ExpandLess /> : <ExpandMore />;
  }

  return (
    <li>
      <ListItem button component={RouterLink} to={to} {...other}>
        <ListItemText primary={primary} />
        {icon}
      </ListItem>
    </li>
  );
}

ListItemLink.propTypes = {
  open: PropTypes.bool,
  to: PropTypes.string.isRequired,
};

function LinkRouter(props) {
  return <Link {...props} component={RouterLink} />;
}

const Navbar = () => {
  const collapse = useSelector((state) => state.sidebar.open);
  const dispatch = useDispatch();

  const handleMenuCollapse = () => {
    dispatch(toggleSidebar());
  };

  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <>
      <Box>
        <Box className="navbar">
          <Box>
            {collapse
              ? ("unCollapsed",
                (
                  <IconButton onClick={handleMenuCollapse}>
                    <ArrowBackIosRounded />
                  </IconButton>
                ))
              : ("collapsed",
                (
                  <IconButton onClick={handleMenuCollapse}>
                    <MenuRounded />
                  </IconButton>
                ))}
          </Box>

          <Box className="navbar__user-container">
            <Box className="navbar__user-wrapper">
              <Typography sx={{ fontWeight: "bold" }} color="primary">
                Username
              </Typography>
              <span style={{ fontStyle: "italic" }}>Admin</span>
            </Box>
            <Box>
              <Avatar>V</Avatar>
            </Box>
          </Box>
        </Box>

        <Breadcrumbs aria-label="breadcrumb" sx={{ ml: 3, userSelect: "none" }}>
          <LinkRouter
            underline="hover"
            color="inherit"
            to="/"
            // onClick={handleMenuCollapse}
          >
            Home
          </LinkRouter>
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;

            return last ? (
              <Typography color="primary" key={to}>
                {breadcrumbNameMap[to]}
              </Typography>
            ) : (
              <LinkRouter underline="hover" color="inherit" to={to} key={to}>
                {breadcrumbNameMap[to]}
              </LinkRouter>
            );
          })}
        </Breadcrumbs>
      </Box>
    </>
  );
};

export default Navbar;
