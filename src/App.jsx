import HomePage from "./Layout/HomePage";
import Masterlist from "./Pages/Masterlist";
import NotFound from "./Layout/NotFound";
import UserAccounts from "./Pages/Masterlist/UserAccounts";

// ROUTER
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginRoutes, PrivateRoutes } from "./Routes/PrivateRoutes";

// MUI
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

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
                path: "user-accounts",
                element: <UserAccounts />,
              },

              {
                path: "service-provider",
                // element: <ServiceProvider />,
              },

              {
                path: "category",
                // element: <Category />,
              },

              {
                path: "supplier",
                // element: <Supplier />,
              },

              {
                path: "create-asset-registration",
                // element: <CreateAssetRegistration />,
              },
            ],
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
      light: "#33bdc3",
      main: "#00ADB5",
      dark: "#00797e",
      contrastText: "#222831",
    },

    secondary: {
      light: "#60646b",
      main: "#393E46",
      dark: "#272b31",
      contrastText: "#EEEEEE",
    },

    text: {
      light: "#4e535a",
      main: "#222831",
      dark: "#171c22",
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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
