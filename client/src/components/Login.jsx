import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const { setIsLoggedIn } = useOutletContext();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mock auth logic
    if (formData.email && formData.password) {
      e.preventDefault();
      // You'll handle API call here
      // console.log("Sign Up Data:", formData);
      try {
        const res = await axios.post(
          "https://blog-server-liry.onrender.com/login",
          formData
        );
        // console.log(res);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.user.name);
        localStorage.setItem("userId", res.data.user.id);
        setIsLoggedIn(true);
        alert(res.data.message);
        navigate("/");
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          alert(err.response.data.message);
        } else {
          alert("Something went wrong. Try again!");
        }
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow p-4">
          <h3 className="text-center mb-4">Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Sign In
            </button>

            <p className="mt-3 text-center text-muted">
              Dont have an account?{" "}
              <a href="/signup" className="text-decoration-none">
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
