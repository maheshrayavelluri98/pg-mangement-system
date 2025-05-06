import axios from "axios";
import { toast } from "react-toastify";

// Set base URL
const API_URL =
  import.meta.env.VITE_API_URL || "https://pg-mangement-system-3.onrender.com";

// Make sure the API URL doesn't have a trailing slash
const formattedApiUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
axios.defaults.baseURL = formattedApiUrl;

// Debug info
console.log("API URL:", formattedApiUrl);
console.log("Environment:", import.meta.env.MODE);
console.log("Sample full URL:", `${formattedApiUrl}/api/v1/admin/login`);

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add to headers
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log detailed error information
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // If not on login or register page, clear token and redirect
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        toast.error("Session expired. Please login again.");
      }
    }

    return Promise.reject(error);
  }
);

// Room API calls
export const getRooms = async (params = {}) => {
  try {
    const res = await axios.get("/api/v1/rooms", { params });
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to fetch rooms");
    throw err;
  }
};

export const getRoom = async (id) => {
  try {
    const res = await axios.get(`/api/v1/rooms/${id}`);
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to fetch room");
    throw err;
  }
};

export const createRoom = async (roomData) => {
  try {
    const res = await axios.post("/api/v1/rooms", roomData);
    toast.success("Room created successfully");
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to create room");
    throw err;
  }
};

export const updateRoom = async (id, roomData) => {
  try {
    const res = await axios.put(`/api/v1/rooms/${id}`, roomData);
    toast.success("Room updated successfully");
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to update room");
    throw err;
  }
};

export const deleteRoom = async (id) => {
  try {
    const res = await axios.delete(`/api/v1/rooms/${id}`);
    toast.success("Room deleted successfully");
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to delete room");
    throw err;
  }
};

// Tenant API calls
export const getTenants = async (params = {}) => {
  try {
    const res = await axios.get("/api/v1/tenants", { params });
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to fetch tenants");
    throw err;
  }
};

export const getTenant = async (id) => {
  try {
    const res = await axios.get(`/api/v1/tenants/${id}`);
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to fetch tenant");
    throw err;
  }
};

export const createTenant = async (tenantData) => {
  try {
    const res = await axios.post("/api/v1/tenants", tenantData);
    toast.success("Tenant created successfully");
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to create tenant");
    throw err;
  }
};

export const updateTenant = async (id, tenantData) => {
  try {
    const res = await axios.put(`/api/v1/tenants/${id}`, tenantData);
    toast.success("Tenant updated successfully");
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to update tenant");
    throw err;
  }
};

export const deleteTenant = async (id) => {
  try {
    const res = await axios.delete(`/api/v1/tenants/${id}`);
    toast.success("Tenant deleted successfully");
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to delete tenant");
    throw err;
  }
};

// Rent API calls
export const getRents = async (params = {}) => {
  try {
    const res = await axios.get("/api/v1/rents", { params });
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to fetch rents");
    throw err;
  }
};

export const getRent = async (id) => {
  try {
    const res = await axios.get(`/api/v1/rents/${id}`);
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to fetch rent");
    throw err;
  }
};

export const createRent = async (rentData) => {
  try {
    const res = await axios.post("/api/v1/rents", rentData);
    toast.success("Rent record created successfully");
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to create rent record");
    throw err;
  }
};

export const updateRent = async (id, rentData) => {
  try {
    const res = await axios.put(`/api/v1/rents/${id}`, rentData);
    toast.success("Rent record updated successfully");
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to update rent record");
    throw err;
  }
};

export const deleteRent = async (id) => {
  try {
    const res = await axios.delete(`/api/v1/rents/${id}`);
    toast.success("Rent record deleted successfully");
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || "Failed to delete rent record");
    throw err;
  }
};
