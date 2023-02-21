import HomePage from "./Layout/HomePage";
import Masterlist from "./Pages/Masterlist";
import NotFound from "./Layout/NotFound";
import Confirmation from "./Components/Reusable/Confirmation";
import Modules from "./Pages/Masterlist/Modules";
import UserAccounts from "./Pages/Masterlist/UserAccounts";
import ServiceProvider from "./Pages/Masterlist/ServiceProvider";
import Category from "./Pages/Masterlist/Category";
import Supplier from "./Pages/Masterlist/Supplier";

// ROUTER
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginRoutes, PrivateRoutes } from "./Routes/PrivateRoutes";

import { closeToast } from "./Redux/StateManagement/toastSlice";
import { closeDrawer } from "./Redux/StateManagement/drawerSlice";
import { useSelector, useDispatch } from "react-redux";

// MUI
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Dialog, Snackbar, SwipeableDrawer } from "@mui/material";
import RoleManagement from "./Pages/RoleManagement";

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "login",
    element: <LoginRoutes />,
  },
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        children: [
          {
            path: "masterlist",
            element: <Masterlist />,
            children: [
              {
                path: "modules",
                element: <Modules />,
              },
              {
                path: "user-accounts",
                element: <UserAccounts />,
              },

              {
                path: "service-provider",
                element: <ServiceProvider />,
              },

              {
                path: "category",
                element: <Category />,
              },

              {
                path: "supplier",
                element: <Supplier />,
              },

              {
                path: "create-asset-registration",
                // element: <CreateAssetRegistration />,
              },
            ],
          },
          {
            path: "role-management",
            element: <RoleManagement />,
          },
          {
            path: "asset-for-tagging",
            // element: <AssetForTagging />,
          },
          {
            path: "asset-list",
            // element: <AssetList />,
          },
          {
            path: "request",
            // element: <Request />,
            children: [
              {
                path: "transfer",
                // element: <UserAccounts />,
              },
              {
                path: "pull-out",
                // element: <ServiceProvider />,
              },
              {
                path: "evaluation",
                // element: <Category />,
              },
            ],
          },
          {
            path: "on-hand-in-process",
            // element: <OnHandInProcess />,
          },
          {
            path: "disposal",
            // element: <Disposal />,
          },
          {
            path: "reports",
            // element: <Reports />,
            children: [
              {
                path: "report1",
                // element: <UserAccounts />,
              },
              {
                path: "report2",
                // element: <ServiceProvider />,
              },
              {
                path: "report3",
                // element: <Category />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

const theme = createTheme({
  palette: {
    primary: {
      light: "#fabb5b",
      main: "#f9aa33",
      dark: "#ae7623",
      contrastText: "#222831",
    },

    secondary: {
      light: "#5c6d77",
      main: "#344955",
      dark: "#24333b",
      contrastText: "#EEEEEE",
    },

    text: {
      light: "#565e60",
      main: "#2C3639",
      dark: "#1e2527",
      contrastText: "#EEEEEE",
    },

    background: {
      light: "#f1f1f1",
      main: "#EEEEEE",
      dark: "#a6a6a6",
      contrastText: "#222831",
    },

    errorColor: {
      light: "#ee5c5c",
      main: "#EA3434",
      dark: "#a32424",
    },

    success: {
      light: "#6cc893",
      main: "#48bb78",
      dark: "#328254",
      contrastText: "#222831",
    },
  },
});

function App() {
  const {
    open: toastOpen,
    message: toastMessage,
    duration: toastDuration,
  } = useSelector((state) => state.toast);

  const {
    open: confirmOpen,
    icon: confirmIcon,
    iconProps: confirmIconProps,
    message: confirmMessage,
    onConfirm: confirmFunction,
  } = useSelector((state) => state.confirm);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeToast());
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <RouterProvider router={router} />

      <Snackbar
        open={toastOpen}
        autoHideDuration={toastDuration}
        onClose={handleClose}
        message={toastMessage}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      />

      <Dialog
        open={confirmOpen}
        sx={{
          ".MuiPaper-root": {
            alignItems: "center",
            padding: "20px",
            margin: 0,
            gap: "5px",
            minWidth: "250px",
            maxWidth: "350px",
            width: "50%",
            textAlign: "center",
            borderRadius: "10px",
          },
        }}
      >
        <Confirmation
          message={confirmMessage}
          icon={confirmIcon}
          iconProps={confirmIconProps}
          onConfirm={confirmFunction}
        />
      </Dialog>
    </ThemeProvider>
  );
}

export default App;
