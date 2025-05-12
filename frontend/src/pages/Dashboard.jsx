import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaDoorOpen,
  FaUsers,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaSync,
  FaArrowRight,
  FaPlusCircle,
  FaRegCalendarPlus,
  FaChartLine,
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    partiallyOccupiedRooms: 0,
    fullyOccupiedRooms: 0,
    totalTenants: 0,
    pendingRents: 0,
  });
  const [loading, setLoading] = useState(true);

  // Function to fetch dashboard stats
  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/dashboard/stats");
      if (res.data.success) {
        setStats(res.data.data);
      } else {
        setStats({
          totalRooms: 0,
          occupiedRooms: 0,
          partiallyOccupiedRooms: 0,
          fullyOccupiedRooms: 0,
          totalTenants: 0,
          pendingRents: 0,
        });
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      // Set default values if API call fails
      setStats({
        totalRooms: 0,
        occupiedRooms: 0,
        partiallyOccupiedRooms: 0,
        fullyOccupiedRooms: 0,
        totalTenants: 0,
        pendingRents: 0,
      });
      setLoading(false);
    }
  };

  // Fetch stats on component mount and when navigating back to dashboard
  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="premium-dashboard responsive-container">
        <div className="premium-tenant-loading">
          <div className="premium-tenant-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-dashboard responsive-container">
      <div className="premium-welcome-banner">
        <div className="premium-welcome-content">
          <h1 className="premium-welcome-title">
            Welcome to Sebzy PG Management
          </h1>
          <p className="premium-welcome-subtitle">
            Manage your PG hostel efficiently with our comprehensive dashboard
          </p>
        </div>
      </div>

      <div className="premium-dashboard-header">
        <h2 className="premium-dashboard-title">Dashboard Overview</h2>
        <button
          onClick={fetchStats}
          className="premium-refresh-button"
          disabled={loading}
        >
          <FaSync
            className={`premium-refresh-icon ${loading ? "animate-spin" : ""}`}
          />
          Refresh Stats
        </button>
      </div>

      {/* Stats Cards */}
      <div className="premium-stats-container responsive-grid">
        {/* Rooms Card */}
        <Link to="/rooms" className="premium-stats-card rooms">
          <div className="premium-stats-header">
            <div
              className="premium-stats-icon-wrapper"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              }}
            >
              <FaDoorOpen className="premium-stats-icon" />
            </div>
            <div className="premium-stats-info">
              <div className="premium-stats-label" style={{ color: "#3b82f6" }}>
                Total Rooms
              </div>
              <div className="premium-stats-value">{stats.totalRooms}</div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {stats.fullyOccupiedRooms} fully occupied,{" "}
              {stats.partiallyOccupiedRooms} partially occupied,{" "}
              {stats.totalRooms - stats.occupiedRooms} vacant
            </p>
            <div className="premium-progress-container">
              <div className="flex h-full">
                <div
                  className="premium-progress-bar"
                  style={{
                    width: `${
                      (stats.fullyOccupiedRooms / stats.totalRooms) * 100
                    }%`,
                    background: "linear-gradient(to right, #3b82f6, #1d4ed8)",
                  }}
                ></div>
                <div
                  className="premium-progress-bar"
                  style={{
                    width: `${
                      (stats.partiallyOccupiedRooms / stats.totalRooms) * 100
                    }%`,
                    background: "linear-gradient(to right, #60a5fa, #3b82f6)",
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="premium-stats-footer">
            <div className="premium-stats-link" style={{ color: "#3b82f6" }}>
              Manage rooms{" "}
              <FaArrowRight className="premium-stats-link-icon" size={12} />
            </div>
          </div>
        </Link>

        {/* Tenants Card */}
        <Link to="/tenants" className="premium-stats-card tenants">
          <div className="premium-stats-header">
            <div
              className="premium-stats-icon-wrapper"
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
              }}
            >
              <FaUsers className="premium-stats-icon" />
            </div>
            <div className="premium-stats-info">
              <div className="premium-stats-label" style={{ color: "#10b981" }}>
                Total Tenants
              </div>
              <div className="premium-stats-value">{stats.totalTenants}</div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {stats.totalTenants > 0
                ? `${Math.round(
                    (stats.totalTenants / (stats.totalRooms * 2)) * 100
                  )}% occupancy rate`
                : "No tenants registered yet"}
            </p>
            <div className="premium-progress-container">
              <div
                className="premium-progress-bar"
                style={{
                  width: `${Math.min(
                    (stats.totalTenants / (stats.totalRooms * 2)) * 100,
                    100
                  )}%`,
                  background: "linear-gradient(to right, #10b981, #059669)",
                }}
              ></div>
            </div>
          </div>
          <div className="premium-stats-footer">
            <div className="premium-stats-link" style={{ color: "#10b981" }}>
              View all tenants{" "}
              <FaArrowRight className="premium-stats-link-icon" size={12} />
            </div>
          </div>
        </Link>

        {/* Pending Rents Card */}
        <Link to="/rent-management" className="premium-stats-card rents">
          <div className="premium-stats-header">
            <div
              className="premium-stats-icon-wrapper"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
              }}
            >
              <FaMoneyBillWave className="premium-stats-icon" />
            </div>
            <div className="premium-stats-info">
              <div className="premium-stats-label" style={{ color: "#f59e0b" }}>
                Pending Rents
              </div>
              <div className="premium-stats-value">{stats.pendingRents}</div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {stats.pendingRents > 0
                ? `${stats.pendingRents} payment${
                    stats.pendingRents !== 1 ? "s" : ""
                  } due`
                : "All rents are paid"}
            </p>
            <div className="premium-progress-container">
              <div
                className="premium-progress-bar"
                style={{
                  width: `${Math.min(
                    (stats.pendingRents / stats.totalTenants) * 100,
                    100
                  )}%`,
                  background: "linear-gradient(to right, #f59e0b, #d97706)",
                }}
              ></div>
            </div>
          </div>
          <div className="premium-stats-footer">
            <div className="premium-stats-link" style={{ color: "#f59e0b" }}>
              View pending rents{" "}
              <FaArrowRight className="premium-stats-link-icon" size={12} />
            </div>
          </div>
        </Link>

        {/* Vacant Rooms Card */}
        <Link to="/rooms" className="premium-stats-card vacant">
          <div className="premium-stats-header">
            <div
              className="premium-stats-icon-wrapper"
              style={{
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
              }}
            >
              <FaExclamationTriangle className="premium-stats-icon" />
            </div>
            <div className="premium-stats-info">
              <div className="premium-stats-label" style={{ color: "#ef4444" }}>
                Vacant Rooms
              </div>
              <div className="premium-stats-value">
                {stats.totalRooms - stats.occupiedRooms}
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {stats.totalRooms - stats.occupiedRooms > 0
                ? `${Math.round(
                    ((stats.totalRooms - stats.occupiedRooms) /
                      stats.totalRooms) *
                      100
                  )}% vacancy rate`
                : "All rooms are occupied"}
            </p>
            <div className="premium-progress-container">
              <div
                className="premium-progress-bar"
                style={{
                  width: `${
                    ((stats.totalRooms - stats.occupiedRooms) /
                      stats.totalRooms) *
                    100
                  }%`,
                  background: "linear-gradient(to right, #ef4444, #dc2626)",
                }}
              ></div>
            </div>
          </div>
          <div className="premium-stats-footer">
            <div className="premium-stats-link" style={{ color: "#ef4444" }}>
              Manage vacant rooms{" "}
              <FaArrowRight className="premium-stats-link-icon" size={12} />
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="premium-actions-section">
        <h2 className="premium-actions-title">Quick Actions</h2>
        <div className="premium-actions-grid responsive-flex">
          <Link
            to="/rooms/add"
            className="premium-action-button"
            style={{
              background: "linear-gradient(to right, #3b82f6, #1d4ed8)",
            }}
          >
            <FaPlusCircle className="mr-2" /> Add New Room
          </Link>
          <Link
            to="/tenants/add"
            className="premium-action-button"
            style={{
              background: "linear-gradient(to right, #10b981, #059669)",
            }}
          >
            <FaUsers className="mr-2" /> Add New Tenant
          </Link>
          <Link
            to="/rents/add"
            className="premium-action-button"
            style={{
              background: "linear-gradient(to right, #f59e0b, #d97706)",
            }}
          >
            <FaRegCalendarPlus className="mr-2" /> Record Rent Payment
          </Link>
        </div>
      </div>

      {/* Recent Activity - Placeholder */}
      <div className="premium-activity-section">
        <h2 className="premium-activity-title">Recent Activity</h2>
        <div className="premium-activity-empty">
          <FaChartLine className="mx-auto mb-3 text-gray-400" size={24} />
          <p>No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
