import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          // Set axios default headers
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Get admin data
          const res = await axios.get("/api/v1/admin/me");

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

  // Register admin
  const register = async (adminData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("/api/v1/admin/register", adminData);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;

        // Get admin data
        const adminRes = await axios.get("/api/v1/admin/me");

        setAdmin(adminRes.data.data);
        setIsAuthenticated(true);
        toast.success("Registration successful!");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      toast.error(err.response?.data?.error || "Registration failed");
    }

    setLoading(false);
  };

  // Login admin
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Attempting login with:", {
        email,
        baseURL: axios.defaults.baseURL,
      });

      const res = await axios.post("/api/v1/admin/login", { email, password });
      console.log("Login response:", res.data);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;

        // Get admin data
        console.log("Fetching admin data...");
        const adminRes = await axios.get("/api/v1/admin/me");
        console.log("Admin data response:", adminRes.data);

        setAdmin(adminRes.data.data);
        setIsAuthenticated(true);
        toast.success("Login successful!");
      }
    } catch (err) {
      console.error("Login error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
        baseURL: axios.defaults.baseURL,
      });

      setError(err.response?.data?.error || "Login failed");
      toast.error(err.response?.data?.error || "Login failed");
    }

    setLoading(false);
  };

  // Logout admin
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setAdmin(null);
    setIsAuthenticated(false);
    toast.info("Logged out successfully");
  };

  // Update admin profile
  const updateProfile = async (adminData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.put("/api/v1/admin/updatedetails", adminData);

      if (res.data.success) {
        setAdmin(res.data.data);
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Profile update failed");
      toast.error(err.response?.data?.error || "Profile update failed");
    }

    setLoading(false);
  };

  // Update admin password
  const updatePassword = async (passwordData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.put("/api/v1/admin/updatepassword", passwordData);

      if (res.data.success) {
        toast.success("Password updated successfully!");
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.error || "Password update failed");
      toast.error(err.response?.data?.error || "Password update failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
