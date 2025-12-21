import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App.tsx";
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import Upload from "./pages/files/Upload.tsx";
import Download from "./pages/files/Download.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Upload /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Register /> },
      { path: "/download/:id", element: <Download /> },
      { path: "/dashboard", element: <Dashboard /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
