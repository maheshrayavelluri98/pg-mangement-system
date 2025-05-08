import React, { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaTimes,
  FaTachometerAlt,
  FaDoorOpen,
  FaUsers,
  FaUserCircle,
  FaFileInvoiceDollar,
} from "react-icons/fa";

const Sidebar = ({ sidebarOpen, setSidebarOpen, auth }) => {
  const { admin } = auth;
  const location = useLocation();

  // Close sidebar on location change (mobile only), but not when sidebar is just opened
  const prevLocation = useRef(location);

  useEffect(() => {
    // Only close if the location actually changed and sidebar is open
    if (sidebarOpen && prevLocation.current.pathname !== location.pathname) {
      setSidebarOpen(false);
    }

    // Update the previous location
    prevLocation.current = location;
  }, [location, setSidebarOpen, sidebarOpen]);

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gradient-to-b from-blue-600 to-indigo-800 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0 ease-out" : "-translate-x-full ease-in"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <NavLink
            to="/dashboard"
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            className="flex items-center"
          >
            <div className="logo-container mr-3">
              <img
                src="/sebzy1-removebg-preview.png"
                alt="Sebzy Logo"
                className="logo-image"
                style={{ maxWidth: "40px", maxHeight: "40px" }}
              />
            </div>

            <div className="flex flex-col">
              <div className="text-2xl font-bold text-white">Sebzy</div>
              <div className="text-sm font-semibold text-blue-200">
                PG Management
              </div>
            </div>
          </NavLink>
          <button
            className="text-white focus:outline-none lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <div className="px-6 py-4 border-t border-blue-700">
          <NavLink
            to="/profile"
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            className="flex items-center hover:bg-blue-700 hover:rounded-lg p-2 transition-colors duration-200"
          >
            <FaUserCircle className="h-10 w-10 text-white" />
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{admin?.name}</p>
              <p className="text-xs text-blue-200">{admin?.pgName}</p>
            </div>
          </NavLink>
        </div>

        <nav className="mt-5 px-3">
          <NavLink
            to="/dashboard"
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-2 text-white transition-colors duration-200 ${
                isActive
                  ? "bg-blue-700 rounded-lg"
                  : "hover:bg-blue-700 hover:rounded-lg"
              }`
            }
          >
            <FaTachometerAlt className="h-5 w-5" />
            <span className="mx-4">Dashboard</span>
          </NavLink>

          <NavLink
            to="/rooms"
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-2 text-white transition-colors duration-200 ${
                isActive
                  ? "bg-blue-700 rounded-lg"
                  : "hover:bg-blue-700 hover:rounded-lg"
              }`
            }
          >
            <FaDoorOpen className="h-5 w-5" />
            <span className="mx-4">Rooms</span>
          </NavLink>

          <NavLink
            to="/tenants"
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-2 text-white transition-colors duration-200 ${
                isActive
                  ? "bg-blue-700 rounded-lg"
                  : "hover:bg-blue-700 hover:rounded-lg"
              }`
            }
          >
            <FaUsers className="h-5 w-5" />
            <span className="mx-4">Tenants</span>
          </NavLink>

          <NavLink
            to="/rent-management"
            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-2 text-white transition-colors duration-200 ${
                isActive
                  ? "bg-blue-700 rounded-lg"
                  : "hover:bg-blue-700 hover:rounded-lg"
              }`
            }
          >
            <FaFileInvoiceDollar className="h-5 w-5" />
            <span className="mx-4">Rent Management</span>
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
