import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import RoomForm from "./pages/RoomForm";
import RoomDetails from "./pages/RoomDetails";
import Tenants from "./pages/Tenants";
import TenantForm from "./pages/TenantForm";
import Rents from "./pages/Rents";
import RentForm from "./pages/RentForm";
import RentManagement from "./pages/RentManagement";
import Profile from "./pages/Profile";

// Components
import Layout from "./components/Layout.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

// Context
import { RoomProvider } from "./context/RoomContext";

// Set base URL for API
axios.defaults.baseURL = "https://pg-management-system-api.onrender.com/api/v1";

function App() {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          // Set axios default headers
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Get admin data
          const res = await axios.get("/admin/me");

          if (res.data.success) {
            setAdmin(res.data.data);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
          }
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      }

      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Auth context value
  const authContextValue = {
    admin,
    isAuthenticated,
    loading,
    login: async (email, password) => {
      try {
        const res = await axios.post("/admin/login", { email, password });

        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.token}`;

          // Get admin data
          const adminRes = await axios.get("/admin/me");

          setAdmin(adminRes.data.data);
          setIsAuthenticated(true);
          toast.success("Login successful!");
          return true;
        }
      } catch (err) {
        toast.error(err.response?.data?.error || "Login failed");
        return false;
      }
    },
    register: async (adminData) => {
      try {
        const res = await axios.post("/admin/register", adminData);

        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.token}`;

          // Get admin data
          const adminRes = await axios.get("/admin/me");

          setAdmin(adminRes.data.data);
          setIsAuthenticated(true);
          toast.success("Registration successful!");
          return true;
        }
      } catch (err) {
        toast.error(err.response?.data?.error || "Registration failed");
        return false;
      }
    },
    logout: () => {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setAdmin(null);
      setIsAuthenticated(false);
      toast.info("Logged out successfully");
    },
    updateProfile: async (adminData) => {
      try {
        const res = await axios.put("/admin/updatedetails", adminData);

        if (res.data.success) {
          setAdmin(res.data.data);
          toast.success("Profile updated successfully!");
          return true;
        }
      } catch (err) {
        toast.error(err.response?.data?.error || "Profile update failed");
        return false;
      }
    },
    updatePassword: async (passwordData) => {
      try {
        const res = await axios.put("/admin/updatepassword", passwordData);

        if (res.data.success) {
          toast.success("Password updated successfully!");
          return true;
        }
      } catch (err) {
        toast.error(err.response?.data?.error || "Password update failed");
        return false;
      }
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen responsive-container">
        <div className="premium-tenant-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 responsive-container">
      <RoomProvider>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login auth={authContextValue} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? (
                <Register auth={authContextValue} />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Layout auth={authContextValue} />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="rooms/add" element={<RoomForm />} />
            <Route path="rooms/edit/:id" element={<RoomForm />} />
            <Route path="rooms/details/:id" element={<RoomDetails />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="tenants/add" element={<TenantForm />} />
            <Route path="tenants/edit/:id" element={<TenantForm />} />
            <Route path="rents" element={<Rents />} />
            <Route path="rents/add" element={<RentForm />} />
            <Route path="rents/edit/:id" element={<RentForm />} />
            <Route path="rent-management" element={<RentManagement />} />
            <Route
              path="profile"
              element={<Profile auth={authContextValue} />}
            />
          </Route>

          {/* Catch all - redirect to dashboard if logged in, otherwise to login */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </RoomProvider>
    </div>
  );
}

export default App;
