import React from "react";
import { Link } from "react-router-dom";
import { FaBars, FaUserCircle, FaSignOutAlt, FaCog } from "react-icons/fa";

const Navbar = ({ sidebarOpen, setSidebarOpen, auth }) => {
  const { admin, logout } = auth;

  return (
    <header className="bg-gradient-to-r from-white to-blue-50 shadow-md z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="text-gray-500 focus:outline-none lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold ml-4 lg:ml-0">
            <span className="text-blue-600 font-bold animate-slideRight">Sebzy</span>{" "}
            <span className="text-gray-700">PG Management</span>
          </h1>
        </div>

        <div className="relative">
          <div className="flex items-center">
            <div className="hidden md:block mr-4">
              <span className="text-sm text-gray-700">{admin?.name}</span>
            </div>
            <div className="relative">
              <button
                className="flex items-center focus:outline-none"
                onClick={() =>
                  document
                    .getElementById("userDropdown")
                    .classList.toggle("hidden")
                }
              >
                <FaUserCircle className="h-8 w-8 text-gray-500" />
              </button>

              <div
                id="userDropdown"
                className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
              >
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <FaCog className="mr-2" />
                    Profile Settings
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
