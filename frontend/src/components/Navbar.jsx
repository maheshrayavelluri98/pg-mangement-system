import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaBell,
  FaChevronDown,
  FaUser,
  FaBuilding,
} from "react-icons/fa";

const Navbar = ({ sidebarOpen, setSidebarOpen, auth }) => {
  const { admin, logout } = auth;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gradient-to-r from-white to-blue-50 shadow-md z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="lg:hidden p-2 rounded-md transition-colors duration-200"
            style={{ background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)' }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <FaBars className="h-6 w-6 text-white" />
          </button>
          <h1 className="text-xl font-semibold ml-4 lg:ml-0 hidden sm:block">
            <span className="text-blue-600 font-bold animate-slideRight">
              Sebzy
            </span>{" "}
            <span className="text-gray-700">PG Management</span>
          </h1>
        </div>

        <div className="relative">
          <div className="premium-navbar-right">
            {/* Navigation links */}
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="premium-navbar-nav-link">
                <FaBuilding className="premium-navbar-nav-icon" />
                <span>Dashboard</span>
              </Link>
              <Link to="/rooms" className="premium-navbar-nav-link">
                <FaBuilding className="premium-navbar-nav-icon" />
                <span>Rooms</span>
              </Link>
              <Link to="/tenants" className="premium-navbar-nav-link">
                <FaUser className="premium-navbar-nav-icon" />
                <span>Tenants</span>
              </Link>
            </div>

            {/* User info and dropdown */}
            <div className="premium-navbar-user-info">
              <span className="premium-navbar-user-name">{admin?.name}</span>

              <div className="relative" ref={dropdownRef}>
                <button
                  className="premium-navbar-avatar-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <FaUserCircle className="premium-navbar-avatar-icon" />
                </button>

                {dropdownOpen && (
                  <div className="premium-navbar-dropdown">
                    {/* User info section */}
                    <div className="p-3 bg-gray-50 border-b border-gray-100">
                      <div className="font-medium text-sm text-gray-800">
                        {admin?.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {admin?.email}
                      </div>
                    </div>

                    {/* Menu items */}
                    <Link
                      to="/profile"
                      className="premium-navbar-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaUser className="premium-navbar-dropdown-icon" />
                      My Profile
                    </Link>

                    <Link
                      to="/profile"
                      className="premium-navbar-dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaCog className="premium-navbar-dropdown-icon" />
                      Settings
                    </Link>

                    <div className="premium-navbar-dropdown-divider"></div>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="premium-navbar-dropdown-item w-full text-left"
                    >
                      <FaSignOutAlt className="premium-navbar-dropdown-icon" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
