import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTimes,
  FaTachometerAlt,
  FaDoorOpen,
  FaUsers,
  FaMoneyBillWave,
  FaUserCircle,
  FaBuilding,
} from "react-icons/fa";

const Sidebar = ({ sidebarOpen, setSidebarOpen, auth }) => {
  const { admin } = auth;

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
          <div className="flex items-center">
            <FaBuilding className="h-8 w-8 text-white mr-3" />
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-white">Sebzy</div>
              <div className="text-sm font-semibold text-blue-200">
                PG Management
              </div>
            </div>
          </div>
          <button
            className="text-white focus:outline-none lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <div className="px-6 py-4 border-t border-blue-700">
          <div className="flex items-center">
            <FaUserCircle className="h-10 w-10 text-white" />
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{admin?.name}</p>
              <p className="text-xs text-blue-200">{admin?.pgName}</p>
            </div>
          </div>
        </div>

        <nav className="mt-5 px-3">
          <NavLink
            to="/dashboard"
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
            to="/rents"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 mt-2 text-white transition-colors duration-200 ${
                isActive
                  ? "bg-blue-700 rounded-lg"
                  : "hover:bg-blue-700 hover:rounded-lg"
              }`
            }
          >
            <FaMoneyBillWave className="h-5 w-5" />
            <span className="mx-4">Rent</span>
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
