import React, { useState } from "react";
import "../Style/navbar.scss";
import PropTypes from "prop-types";
import { vladimirAPI } from "../Api/vladimirAPI";

import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { removeUserDetails } from "../Redux/StateManagement/userLogin";
import { toggleSidebar } from "../Redux/StateManagement/sidebar";
import { NotificationsRounded, Padding } from "@mui/icons-material";

import {
  MenuRounded,
  ArrowBackIosRounded,
  Help,
  Info,
  Settings,
  Logout,
  Menu as MenuIcon,
} from "@mui/icons-material";

import {
  Avatar,
  Box,
  IconButton,
  Typography,
  Breadcrumbs,
  Link,
  Menu,
  MenuItem,
  ListItemIcon,
  Fade,
  ListItemText,
  Divider,
  Tooltip,
  Zoom,
} from "@mui/material";

const breadcrumbNameMap = {
  "/masterlist": "Masterlist",
  "/masterlist/modules": "Modules",
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
  const userDetails = useSelector((state) => state.userLogin);
  const dispatch = useDispatch();

  const handleMenuCollapse = () => {
    dispatch(toggleSidebar());
  };

  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const userLogout = useNavigate();

  // User Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogoutHandler = async (data) => {
    try {
      const res = await vladimirAPI.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch(removeUserDetails());
      userLogout("/login");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <Box>
        <Box className="navbar">
          <Box>
            {collapse ? (
              <IconButton onClick={handleMenuCollapse}>
                <ArrowBackIosRounded />
              </IconButton>
            ) : (
              <IconButton onClick={handleMenuCollapse}>
                <MenuRounded />
              </IconButton>
            )}
          </Box>

          <Box className="navbar__user-container">
            <Tooltip title="Notification" TransitionComponent={Zoom} arrow>
              <IconButton color="secondary">
                <NotificationsRounded />
              </IconButton>
            </Tooltip>

            <Tooltip title="Settings" TransitionComponent={Zoom} arrow>
              <Box className="navbar__iconBtn">
                <IconButton color="secondary" variant="contained">
                  <Settings />
                </IconButton>
              </Box>
            </Tooltip>

            <Tooltip title="Account" TransitionComponent={Zoom} arrow>
              <IconButton onClick={handleOpen}>
                <Avatar
                  sx={{
                    cursor: "pointer",
                    height: "30px",
                    width: "30px",
                    bgcolor: "primary.main",
                  }}
                >
                  {userDetails?.user.username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Breadcrumbs aria-label="breadcrumb" sx={{ ml: 3, userSelect: "none" }}>
          <LinkRouter underline="hover" color="inherit" to="/">
            Home
          </LinkRouter>
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join("/")}`;

            return last ? (
              <Typography
                color="secondary"
                sx={{ fontWeight: "bold" }}
                key={to}
              >
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

      <Menu
        PaperProps={{
          className: "navbar__menu",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        disablePortal
      >
        <Box className="navbar__menu-settings">
          <Avatar
            sx={{
              cursor: "pointer",
              height: "20px",
              width: "20px",
              bgcolor: "primary.main",
            }}
          />
          <Typography
            sx={{
              padding: "5px",
              fontWeight: "bold",
              pl: 2,
            }}
            color="text.light"
          >
            {userDetails?.user.username.charAt(0).toUpperCase() +
              userDetails?.user.username.slice(1)}
          </Typography>
        </Box>

        <Divider sx={{ mx: 2, my: 0.5 }} />

        <MenuItem onClick={handleClose} dense>
          <ListItemIcon>
            <Help />
          </ListItemIcon>
          <ListItemText>Help</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleClose} dense>
          <ListItemIcon>
            <Info />
          </ListItemIcon>
          <ListItemText>About</ListItemText>
        </MenuItem>

        {/* <MenuItem onClick={handleClose} dense>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem> */}

        <Divider sx={{ mx: 2 }} />

        <MenuItem onClick={onLogoutHandler} dense>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;
