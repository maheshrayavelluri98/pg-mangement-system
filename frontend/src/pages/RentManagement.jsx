import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaCheck,
  FaClock,
  FaFilter,
  FaMoneyBillWave,
  FaPlus,
  FaSync,
  FaExclamationTriangle,
} from "react-icons/fa";

const RentManagement = () => {
  const [loading, setLoading] = useState(true);
  const [processingRent, setProcessingRent] = useState(false);
  const [overdueRents, setOverdueRents] = useState([]);
  const [allRents, setAllRents] = useState([]);
  const [activeTab, setActiveTab] = useState("overdue");
  const [filter, setFilter] = useState("all");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRent, setSelectedRent] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: 0,
    paymentMethod: "Cash",
    paymentReference: "",
    notes: "",
  });

  // Fetch overdue rents
  const fetchOverdueRents = async () => {
    try {
      const res = await axios.get("/rents/overdue");
      if (res.data.success) {
        setOverdueRents(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching overdue rents:", err);
      toast.error("Failed to fetch overdue rents");
    }
  };

  // Fetch all rents
  const fetchAllRents = async () => {
    try {
      const res = await axios.get("/rents");
      if (res.data.success) {
        setAllRents(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching all rents:", err);
      toast.error("Failed to fetch all rents");
    }
  };

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchOverdueRents(), fetchAllRents()]);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Generate monthly rents for all tenants
  const generateMonthlyRents = async () => {
    setProcessingRent(true);
    try {
      const res = await axios.post("/rents/generate-monthly");
      if (res.data.success) {
        toast.success(
          `Generated ${res.data.data.created} rent records for ${res.data.data.month}/${res.data.data.year}`
        );
        fetchAllData();
      } else {
        toast.error("Failed to generate monthly rents");
      }
    } catch (err) {
      console.error("Error generating monthly rents:", err);
      toast.error(
        err.response?.data?.error || "Failed to generate monthly rents"
      );
    } finally {
      setProcessingRent(false);
    }
  };

  // Create rent records for tenants
  const createRentRecords = async (rents) => {
    setProcessingRent(true);
    try {
      const res = await axios.post("/rents/create-auto", {
        rentData: rents,
      });

      if (res.data.success) {
        toast.success(`Created ${res.data.count} rent records successfully`);
        fetchAllData(); // Refresh data after creating rent records
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

  // Mark rent as paid
  const markRentAsPaid = async (rentId, amount = null) => {
    setProcessingRent(true);
    try {
      const paymentData = {
        paymentMethod: paymentDetails.paymentMethod,
        paymentReference: paymentDetails.paymentReference,
        notes: paymentDetails.notes,
      };

      if (amount) {
        paymentData.amount = amount;
      }

      const res = await axios.put(`/rents/${rentId}/pay`, paymentData);

      if (res.data.success) {
        toast.success("Rent marked as paid successfully");
        if (res.data.nextRent) {
          toast.info("Next month's rent record created automatically");
        }
        setShowPaymentModal(false);
        setSelectedRent(null);
        fetchAllData();
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

  // Handle payment modal open
  const openPaymentModal = (rent) => {
    setSelectedRent(rent);
    setPaymentDetails({
      amount: rent.amount - (rent.amountPaid || 0),
      paymentMethod: "Cash",
      paymentReference: "",
      notes: "",
    });
    setShowPaymentModal(true);
  };

  // Filter rents based on status
  const getFilteredRents = () => {
    if (activeTab === "overdue") {
      return overdueRents;
    } else if (activeTab === "records") {
      // Show all rent records sorted by date (most recent first)
      return [...allRents].sort(
        (a, b) => new Date(b.dueDate) - new Date(a.dueDate)
      );
    } else {
      // Filter all rents based on selected filter
      if (filter === "all") {
        return allRents;
      } else if (filter === "paid") {
        return allRents.filter((rent) => rent.isPaid);
      } else if (filter === "pending") {
        return allRents.filter(
          (rent) => !rent.isPaid && rent.status === "Pending"
        );
      } else if (filter === "partial") {
        return allRents.filter(
          (rent) => !rent.isPaid && rent.status === "Partially Paid"
        );
      } else if (filter === "overdue") {
        return allRents.filter(
          (rent) => !rent.isPaid && rent.status === "Overdue"
        );
      }
      return allRents;
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAllData();
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-bold mb-2">Rent Management</h1>
        <p className="text-blue-100">
          Track and manage tenant rent payments efficiently
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("overdue")}
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeTab === "overdue"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaClock className="mr-2" /> Overdue
            {overdueRents.length > 0 && (
              <span className="ml-2 bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {overdueRents.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("records")}
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeTab === "records"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaMoneyBillWave className="mr-2" /> Rent Records
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeTab === "all"
                ? "bg-purple-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaFilter className="mr-2" /> All Rents
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={fetchAllData}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            <FaSync className={`mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            to="/rents/add"
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add New Rent
          </Link>
        </div>
      </div>

      {activeTab === "all" && (
        <div className="mb-4 flex items-center">
          <span className="mr-2 text-gray-700">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Rents</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="partial">Partially Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      )}

      {activeTab === "records" && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Rent Records
          </h2>
          <p className="text-sm text-gray-600">
            View all rent records sorted by due date (most recent first). Use
            this section to track all rent payments.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFilteredRents().length > 0 ? (
                getFilteredRents().map((rent) => (
                  <tr key={rent._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {rent.tenantId ? rent.tenantId.name : "Unknown Tenant"}
                      </div>
                      {rent.tenantId && rent.tenantId.phone && (
                        <div className="text-xs text-gray-500">
                          {rent.tenantId.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {rent.roomId
                          ? `Floor ${rent.roomId.floorNumber}, Room ${rent.roomId.roomNumber}`
                          : "Unknown Room"}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getMonthName(rent.month)} {rent.year}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(rent.dueDate).toLocaleDateString()}
                      </div>
                      {activeTab === "overdue" && rent.daysOverdue && (
                        <div className="text-xs font-medium text-red-600">
                          {rent.daysOverdue} days overdue
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{rent.amount}
                      </div>
                      {rent.amountPaid > 0 && rent.amountPaid < rent.amount && (
                        <div className="text-xs text-gray-500">
                          Paid: ₹{rent.amountPaid} | Due: ₹
                          {rent.amount - rent.amountPaid}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          rent.isPaid
                            ? "bg-green-100 text-green-800"
                            : rent.status === "Overdue"
                            ? "bg-red-100 text-red-800"
                            : rent.status === "Partially Paid"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {rent.isPaid ? "Paid" : rent.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        {rent.needsRecord ? (
                          <button
                            onClick={() =>
                              createRentRecords([
                                {
                                  tenantId: rent.tenantId._id,
                                  amount: rent.amount,
                                  month: rent.month,
                                  year: rent.year,
                                  dueDate: rent.dueDate,
                                },
                              ])
                            }
                            className="flex items-center px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded hover:from-blue-600 hover:to-blue-700 transition-colors"
                            disabled={processingRent}
                          >
                            <FaPlus className="mr-1" /> Create Record
                          </button>
                        ) : (
                          !rent.isPaid && (
                            <button
                              onClick={() => openPaymentModal(rent)}
                              className="flex items-center px-2 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded hover:from-green-600 hover:to-green-700 transition-colors"
                              disabled={processingRent}
                            >
                              <FaCheck className="mr-1" /> Pay
                            </button>
                          )
                        )}
                        {rent._id ? (
                          <Link
                            to={`/rents/edit/${rent._id}`}
                            className="flex items-center px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded hover:from-blue-600 hover:to-blue-700 transition-colors"
                          >
                            Details
                          </Link>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {activeTab === "upcoming"
                      ? "No upcoming rent dues."
                      : activeTab === "overdue"
                      ? "No overdue rents."
                      : "No rent records found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Create Rent Records Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Bulk Create Rent Records
        </h2>
        <p className="text-gray-600 mb-4">
          Use this section to create rent records for all active tenants for a
          specific month and year. This is useful for generating rent records in
          advance.
        </p>

        <div className="flex items-center space-x-4 mt-6">
          <button
            onClick={generateMonthlyRents}
            disabled={processingRent}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-2 px-6 rounded-lg transition-colors shadow-sm flex items-center"
          >
            {processingRent ? (
              <>
                <FaSync className="inline-block mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FaPlus className="inline-block mr-2" />
                Generate Next Month's Rent Records
              </>
            )}
          </button>

          <Link
            to="/rents/add"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-6 rounded-lg transition-colors shadow-sm flex items-center"
          >
            <FaPlus className="inline-block mr-2" />
            Create Individual Rent Record
          </Link>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedRent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Record Payment</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">
                Tenant:{" "}
                {selectedRent.tenantId ? selectedRent.tenantId.name : "Unknown"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Period: {getMonthName(selectedRent.month)} {selectedRent.year}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Due Date: {new Date(selectedRent.dueDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                Total Amount: ₹{selectedRent.amount}
              </p>
              {selectedRent.amountPaid > 0 && (
                <div className="bg-blue-50 p-2 rounded mb-3">
                  <p className="text-sm text-blue-800">
                    Already Paid: ₹{selectedRent.amountPaid}
                  </p>
                  <p className="text-sm text-blue-800">
                    Remaining: ₹{selectedRent.amount - selectedRent.amountPaid}
                  </p>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Amount
              </label>
              <input
                type="number"
                value={paymentDetails.amount}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    amount: parseFloat(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                max={selectedRent.amount - (selectedRent.amountPaid || 0)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={paymentDetails.paymentMethod}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    paymentMethod: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference (Optional)
              </label>
              <input
                type="text"
                value={paymentDetails.paymentReference}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    paymentReference: e.target.value,
                  })
                }
                placeholder="Transaction ID, Cheque No., etc."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={paymentDetails.notes}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    notes: e.target.value,
                  })
                }
                placeholder="Any additional notes"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  markRentAsPaid(selectedRent._id, paymentDetails.amount)
                }
                disabled={processingRent}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 transition-colors"
              >
                {processingRent ? "Processing..." : "Record Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get month name
const getMonthName = (monthNumber) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNumber - 1];
};

export default RentManagement;
