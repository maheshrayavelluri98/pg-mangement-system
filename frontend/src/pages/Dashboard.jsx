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
  FaCalendarAlt,
  FaCheck,
  FaClock,
  FaPlus,
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    totalTenants: 0,
    pendingRents: 0,
    upcomingDueRents: [],
    overdueRents: [],
  });
  const [loading, setLoading] = useState(true);
  const [processingRent, setProcessingRent] = useState(false);

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
          totalTenants: 0,
          pendingRents: 0,
          upcomingDueRents: [],
          overdueRents: [],
        });
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      // Set default values if API call fails
      setStats({
        totalRooms: 0,
        occupiedRooms: 0,
        totalTenants: 0,
        pendingRents: 0,
        upcomingDueRents: [],
        overdueRents: [],
      });
      setLoading(false);
    }
  };

  // Function to create rent records automatically
  const createRentRecords = async (rents) => {
    setProcessingRent(true);
    try {
      const res = await axios.post("/rents/create-auto", {
        rentData: rents,
      });

      if (res.data.success) {
        toast.success(`Created ${res.data.count} rent records successfully`);
        fetchStats(); // Refresh stats after creating rent records
      } else {
        toast.error("Failed to create rent records");
      }
    } catch (err) {
      console.error("Error creating rent records:", err);
      toast.error(err.response?.data?.error || "Failed to create rent records");
    } finally {
      setProcessingRent(false);
    }
  };

  // Function to mark rent as paid
  const markRentAsPaid = async (rentId) => {
    setProcessingRent(true);
    try {
      const res = await axios.put(`/rents/${rentId}/pay`, {
        paymentMethod: "Cash",
      });

      if (res.data.success) {
        toast.success("Rent marked as paid successfully");
        if (res.data.nextRent) {
          toast.info("Next month's rent record created automatically");
        }
        fetchStats(); // Refresh stats after updating rent
      } else {
        toast.error("Failed to mark rent as paid");
      }
    } catch (err) {
      console.error("Error marking rent as paid:", err);
      toast.error(err.response?.data?.error || "Failed to mark rent as paid");
    } finally {
      setProcessingRent(false);
    }
  };

  // Fetch stats on component mount and when navigating back to dashboard
  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-blue-600 text-white p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to Sebzy PG Management
        </h1>
        <p className="text-blue-100">
          Manage your PG hostel efficiently with our comprehensive dashboard
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Dashboard Overview
        </h2>
        <button
          onClick={fetchStats}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          <FaSync className={`mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh Stats
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white mr-4">
              <FaDoorOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-blue-600 uppercase font-medium">
                Total Rooms
              </p>
              <p className="text-2xl font-semibold text-gray-800">
                {stats.totalRooms}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {stats.occupiedRooms} occupied,{" "}
              {stats.totalRooms - stats.occupiedRooms} vacant
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${(stats.occupiedRooms / stats.totalRooms) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white mr-4">
              <FaUsers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-green-600 uppercase font-medium">
                Total Tenants
              </p>
              <p className="text-2xl font-semibold text-gray-800">
                {stats.totalTenants}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/tenants"
              className="text-sm text-green-600 hover:text-green-800 transition-colors"
            >
              View all tenants
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white mr-4">
              <FaMoneyBillWave className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 uppercase font-medium">
                Pending Rents
              </p>
              <p className="text-2xl font-semibold text-gray-800">
                {stats.pendingRents}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/rents"
              className="text-sm text-yellow-600 hover:text-yellow-800 transition-colors"
            >
              View pending rents
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white mr-4">
              <FaExclamationTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-red-600 uppercase font-medium">
                Vacant Rooms
              </p>
              <p className="text-2xl font-semibold text-gray-800">
                {stats.totalRooms - stats.occupiedRooms}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/rooms"
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Manage rooms
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/rooms/add"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg text-center transition-all shadow-sm hover:shadow"
          >
            Add New Room
          </Link>
          <Link
            to="/tenants/add"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg text-center transition-all shadow-sm hover:shadow"
          >
            Add New Tenant
          </Link>
          <Link
            to="/rents/add"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-3 px-4 rounded-lg text-center transition-all shadow-sm hover:shadow"
          >
            Record Rent Payment
          </Link>
        </div>
      </div>

      {/* Rent Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Upcoming Rent Dues */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              <FaCalendarAlt className="inline-block mr-2 text-blue-500" />
              Upcoming Rent Dues
            </h2>
            {stats.upcomingDueRents.length > 0 &&
              !stats.upcomingDueRents.some((rent) => !rent._id) && (
                <button
                  onClick={() => navigate("/rents")}
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded transition-colors"
                >
                  View All
                </button>
              )}
          </div>

          {stats.upcomingDueRents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.upcomingDueRents.map((rent, index) => (
                    <tr
                      key={rent._id || `upcoming-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {rent.tenant.name}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          Floor {rent.room.floorNumber}, Room{" "}
                          {rent.room.roomNumber}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(rent.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          ₹{rent.amount}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-center">
                        {rent._id ? (
                          <button
                            onClick={() => markRentAsPaid(rent._id)}
                            disabled={processingRent}
                            className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded hover:from-green-600 hover:to-green-700 transition-colors"
                          >
                            <FaCheck className="mr-1" /> Mark Paid
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              createRentRecords([
                                {
                                  tenantId: rent.tenant._id,
                                  amount: rent.amount,
                                  month: rent.month,
                                  year: rent.year,
                                  dueDate: rent.dueDate,
                                },
                              ])
                            }
                            disabled={processingRent}
                            className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded hover:from-blue-600 hover:to-blue-700 transition-colors"
                          >
                            <FaPlus className="mr-1" /> Create Record
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No upcoming rent dues.</p>
            </div>
          )}
        </div>

        {/* Overdue Rents */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              <FaClock className="inline-block mr-2 text-red-500" />
              Overdue Rents
            </h2>
            {stats.overdueRents.length > 0 && (
              <button
                onClick={() => navigate("/rents")}
                className="text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded transition-colors"
              >
                View All
              </button>
            )}
          </div>

          {stats.overdueRents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days Late
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.overdueRents.map((rent) => (
                    <tr key={rent._id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {rent.tenant.name}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          Floor {rent.room.floorNumber}, Room{" "}
                          {rent.room.roomNumber}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(rent.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-red-600">
                          {rent.daysPastDue} days
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-center">
                        <button
                          onClick={() => markRentAsPaid(rent._id)}
                          disabled={processingRent}
                          className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded hover:from-green-600 hover:to-green-700 transition-colors"
                        >
                          <FaCheck className="mr-1" /> Mark Paid
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No overdue rents.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create All Pending Rent Records Button */}
      {stats.upcomingDueRents.length > 0 &&
        stats.upcomingDueRents.some((rent) => !rent._id) && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Pending Rent Records
                </h2>
                <p className="text-sm text-gray-600">
                  You have{" "}
                  {stats.upcomingDueRents.filter((rent) => !rent._id).length}{" "}
                  pending rent records that need to be created.
                </p>
              </div>
              <button
                onClick={() =>
                  createRentRecords(
                    stats.upcomingDueRents
                      .filter((rent) => !rent._id)
                      .map((rent) => ({
                        tenantId: rent.tenant._id,
                        amount: rent.amount,
                        month: rent.month,
                        year: rent.year,
                        dueDate: rent.dueDate,
                      }))
                  )
                }
                disabled={processingRent}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-2 px-4 rounded-lg transition-colors shadow-sm"
              >
                {processingRent ? (
                  <>
                    <FaSync className="inline-block mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaPlus className="inline-block mr-2" />
                    Create All Pending Records
                  </>
                )}
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default Dashboard;
