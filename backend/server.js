const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const adminRoutes = require("./routes/adminRoutes");
const roomRoutes = require("./routes/roomRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const rentRoutes = require("./routes/rentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/tenants", tenantRoutes);
app.use("/api/v1/rents", rentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("PG Management System API is running...");
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
