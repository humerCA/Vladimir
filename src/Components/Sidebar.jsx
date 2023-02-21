import React, { useEffect, useState } from "react";
import "../Style/sidebar.scss";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openSidebar } from "../Redux/StateManagement/sidebar";
import { toggleSidebar } from "../Redux/StateManagement/sidebar";

//Img
import VladimirLogoSmally from "../Img/VladimirSmally.png";
import MisLogo from "../Img/MIS LOGO.png";

// Components
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Collapse,
  Divider,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import Zoom from "@mui/material/Zoom";

// Icons
import {
  Close,
  Dashboard,
  ListAlt,
  DatasetRounded,
  AccountBox,
  LocalOffer,
  RecentActors,
  ManageAccountsSharp,
  Category,
  Inventory2Rounded,
  NoteAddRounded,
  FormatListBulletedRounded,
  AssignmentIndRounded,
  ClassRounded,
  PlaylistRemoveRounded,
  SummarizeRounded,
  ArrowBackIosRounded,
} from "@mui/icons-material";

const Sidebar = () => {
  const [masterlistCollapse, setMasterlistCollapse] = useState(false);
  const [requestCollapse, setRequestCollapse] = useState(false);
  const [reportCollapse, setReportCollapse] = useState(false);

  const dispatch = useDispatch();
  const collapse = useSelector((state) => state.sidebar.open);

  const handleMenuCollapse = () => {
    dispatch(toggleSidebar());
  };

  const closeCollapse = () => {
    setMasterlistCollapse(false);
    setRequestCollapse(false);
    setReportCollapse(false);
  };

  const MENU_LIST = [
    {
      label: "Dashboard",
      icon: Dashboard,
      path: "/",
      permission: [],
      setter: closeCollapse,
    },
    {
      label: "Masterlist",
      icon: ListAlt,
      path: "/masterlist",
      permission: [],
      children: [
        {
          label: "Modules",
          icon: DatasetRounded,
          path: "/masterlist/modules",
          permission: [],
        },
        {
          label: "User Accounts",
          icon: AccountBox,
          path: "/masterlist/user-accounts",
          permission: [],
        },
        {
          label: "Service Provider",
          icon: RecentActors,
          path: "/masterlist/service-provider",
          permission: [],
        },
        {
          label: "Category",
          icon: Category,
          path: "/masterlist/category",
          permission: [],
        },
        {
          label: "Supplier",
          icon: Inventory2Rounded,
          path: "/masterlist/supplier",
          permission: [],
        },
        {
          label: "Asset Registration",
          icon: NoteAddRounded,
          path: "masterlist/create-asset-registration",
          permission: [],
        },
      ],
      open: masterlistCollapse,
      setter: () => {
        setMasterlistCollapse(!masterlistCollapse);
        setRequestCollapse(false);
        setReportCollapse(false);
        dispatch(openSidebar());
      },
    },
    {
      label: "Role Management",
      icon: ManageAccountsSharp,
      path: "/role-management",
      permission: [],
      setter: closeCollapse,
    },
    {
      label: "Asset for Tagging",
      icon: LocalOffer,
      path: "/asset-for-tagging",
      permission: [],
      setter: closeCollapse,
    },
    {
      label: "Asset List",
      icon: FormatListBulletedRounded,
      path: "/asset-list",
      permission: [],
      setter: closeCollapse,
    },
    {
      label: "Request",
      icon: AssignmentIndRounded,
      path: "/request",
      permission: [],
      children: [
        {
          label: "Transfer",
          icon: AccountBox,
          path: "/request/transfer",
          permission: [],
        },
        {
          label: "Pull Out",
          icon: ManageAccountsSharp,
          path: "/request/pull-out",
          permission: [],
        },
        {
          label: "Evaluation",
          icon: Category,
          path: "/request/evaluation",
          permission: [],
        },
      ],
      open: requestCollapse,
      setter: () => {
        setRequestCollapse(!requestCollapse);
        setMasterlistCollapse(false);
        setReportCollapse(false);
        dispatch(openSidebar());
      },
    },
    {
      label: "On Hand in Process",
      icon: ClassRounded,
      path: "/on-hand-in-process",
      permission: [],
      setter: closeCollapse,
    },
    {
      label: "Disposal",
      icon: PlaylistRemoveRounded,
      path: "/disposal",
      permission: [],
      setter: closeCollapse,
    },
    {
      label: "Reports",
      icon: SummarizeRounded,
      path: "/reports",
      permission: [],
      children: [
        {
          label: "Report 1",
          icon: SummarizeRounded,
          path: "/reports/report1",
          permission: [],
        },
        {
          label: "Report 2",
          icon: SummarizeRounded,
          path: "/reports/report2",
          permission: [],
        },
        {
          label: "Report 3",
          icon: SummarizeRounded,
          path: "/reports/report3",
          permission: [],
        },
      ],
      open: reportCollapse,
      setter: () => {
        setReportCollapse(!reportCollapse);
        setMasterlistCollapse(false);
        setRequestCollapse(false);
        dispatch(openSidebar());
      },
    },
  ];

  const { pathname } = useLocation();
  const location = useLocation();
  // console.log(location);

  useEffect(() => {
    if (!collapse) {
      closeCollapse();
    }

    if (pathname === "/") {
      closeCollapse();
    }

    if (collapse && pathname.match(/masterlist/)) {
      setMasterlistCollapse(true);
    } else if (collapse && pathname.match(/request/)) {
      setRequestCollapse(true);
    } else if (collapse && pathname.match(/reports/)) {
      setReportCollapse(true);
    }
  }, [collapse, pathname]);

  return (
    <>
      <Box className={`sidebar ${collapse ? "" : "collapsed"}`}>
        <Box>
          {collapse ? (
            <IconButton
              className="sidebar__closeBtn"
              sx={{ position: "absolute", right: 10, top: 10, zIndex: 2 }}
              onClick={handleMenuCollapse}
              size="small"
            >
              <ArrowBackIosRounded />
            </IconButton>
          ) : null}
          <Box className="sidebar__logo-container">
            <img
              src={VladimirLogoSmally}
              alt="Vladimir Logo"
              style={{
                width: "40px",
              }}
            />

            <Typography
              color="secondary"
              sx={{
                zIndex: 0,
                fontFamily: "Josefin Sans",
                fontSize: "22px",
                letterSpacing: "6px",
                pl: 2.5,
                userSelect: "none",
              }}
            >
              VLADIMIR
            </Typography>
          </Box>
        </Box>

        <Box className="sidebar__menus">
          <List>
            {MENU_LIST.map((item) => {
              return (
                <ListItem
                  key={item.path}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    padding: 0,
                    px: "10px",
                  }}
                  disablePadding
                  dense
                >
                  <Tooltip
                    title={!collapse && item.label}
                    TransitionComponent={Zoom}
                    placement="right"
                    arrow
                  >
                    <ListItemButton
                      className="sidebar__menu-btn"
                      component={NavLink}
                      to={item.path}
                      sx={{
                        width: collapse ? "225px" : "98%",
                        display: "flex",
                        justifyContent: "flex-start",
                        borderRadius: "12px",
                        px: 0,
                        transition: "0.2s ease-in-out",
                      }}
                      onClick={item?.setter}
                    >
                      <ListItemIcon sx={{ px: 1.9, py: 1 }}>
                        <SvgIcon component={item.icon} />
                      </ListItemIcon>
                      {collapse && (
                        <ListItemText
                          primary={item.label}
                          sx={{ whiteSpace: "nowrap" }}
                        />
                      )}
                    </ListItemButton>
                  </Tooltip>

                  {Boolean(item.children?.length) && (
                    <Collapse
                      in={item.open}
                      timeout="auto"
                      unmountOnExit
                      sx={{ width: "100%" }}
                    >
                      <List
                        component="div"
                        className="sidebar__menu-list"
                        sx={{ pt: 0.5 }}
                      >
                        {item.children.map((childItem, index) => {
                          return (
                            <ListItemButton
                              className="sidebar__menu-btn-list"
                              key={childItem.path}
                              component={NavLink}
                              to={childItem.path}
                              sx={{
                                width: "208px",
                                ml: 2,
                                borderRadius: "12px",
                                px: 0,
                              }}
                              dense
                            >
                              <ListItemIcon sx={{ pl: 2, py: 0.5 }}>
                                <SvgIcon component={childItem.icon} />
                              </ListItemIcon>
                              <ListItemText primary={childItem.label} />
                            </ListItemButton>
                          );
                        })}
                      </List>
                      <Divider sx={{ mb: "10px", mx: "15px" }} />
                    </Collapse>
                  )}
                </ListItem>
              );
            })}
          </List>
        </Box>

        <Box className="sidebar__copyright">
          <img
            src={MisLogo}
            alt="MIS-Logo"
            style={{
              width: "50px",
            }}
          />
          {collapse && (
            <p>
              Powered By MIS All rights reserved <br />
              Copyrights © 2021
            </p>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
