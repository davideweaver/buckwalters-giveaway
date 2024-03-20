import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root";
import { initDB } from "react-indexed-db-hook";
import config from "./lib/db/config";
import Admin from "./routes/Admin";
import Choose from "./routes/Choose";

initDB(config);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/choose",
    element: <Choose />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
