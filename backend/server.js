const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const {
  updateRentStatuses,
  generateMonthlyRents,
  checkForMissingRentRecords,
} = require("./utils/rentScheduler");

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
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://pg-mangement-system.vercel.app"
        : "*",
    credentials: true,
  })
);

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

const PORT = process.env.NODE_ENV === "production" ? process.env.PORT : 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Set up scheduled tasks
// Run rent status update daily at midnight
const runDailyTasks = () => {
  const now = new Date();
  console.log(`Running daily tasks at ${now.toISOString()}`);

  // Update rent statuses (mark as overdue if past due date)
  updateRentStatuses();

  // Check for missing rent records for tenants who have paid their previous month's rent
  checkForMissingRentRecords();

  // Check if it's the 25th day of the month to generate next month's rents
  if (now.getDate() === 25) {
    generateMonthlyRents();
  }
};

// Run immediately on startup
runDailyTasks();

// Then schedule to run daily
setInterval(runDailyTasks, 24 * 60 * 60 * 1000); // 24 hours

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
