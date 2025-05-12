import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./style.css";
import "./styles/logo.css";
import "./styles/amenities.css";
import "./styles/roomCards.css";
import "./styles/rentCards.css";
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/premiumRoomCards.css";
import "./styles/premiumRoomCard.css";
import "./styles/premiumRoomDetails.css";
import "./styles/premiumRoomDetailsExtra.css";
import "./styles/premiumTenantForm.css";
import "./styles/responsive.css";
import "./styles/premiumSidebar.css";
import "./styles/premiumTenantCards.css";
import "./styles/premiumNavbar.css";
import "./styles/matchingRoomCards.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Set up axios defaults
axios.defaults.baseURL = "https://pg-management-system-api.onrender.com/api/v1";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.timeout = 15000; // 15 seconds timeout

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error);
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
