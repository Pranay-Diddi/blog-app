import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreatePost from "./components/CreatePost";
import Login from "./components/Login";
import AllPosts from "./components/AllPosts";
import CreatePostProtector from "./ProtectedRoutes/CreatePostProtector";
import SignUp from "./components/Signup.jsx";
import Dashboard from "./components/Dashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <CreatePostProtector>
            <AllPosts />
          </CreatePostProtector>
        ),
      },
      {
        path: "/create-post",
        element: (
          <CreatePostProtector>
            <CreatePost />
          </CreatePostProtector>
        ),
      },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },
      {
        path: "/dashboard",
        element: (
          <CreatePostProtector>
            <Dashboard />
          </CreatePostProtector>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
