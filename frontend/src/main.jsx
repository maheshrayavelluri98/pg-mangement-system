import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./style.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Set up axios defaults
axios.defaults.baseURL = "https://pg-mangement-system-3.onrender.com/api/v1";
axios.defaults.headers.common["Content-Type"] = "application/json";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
