import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaPhone, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useRooms } from "../context/RoomContext";

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchRooms } = useRooms(); // Get fetchRooms from RoomContext

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await axios.get("/tenants");
        if (res.data.success) {
          setTenants(res.data.data);
        } else {
          setTenants([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tenants:", err);
        toast.error("Failed to fetch tenants");
        setTenants([]);
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tenant?")) {
      try {
        const res = await axios.delete(`/tenants/${id}`);
        if (res.data.success) {
          setTenants(tenants.filter((tenant) => tenant._id !== id));
          toast.success("Tenant deleted successfully");

          // Refresh rooms data to update occupiedBeds count
          fetchRooms();
        } else {
          toast.error(res.data.error || "Failed to delete tenant");
        }
      } catch (err) {
        console.error("Error deleting tenant:", err);
        toast.error(err.response?.data?.error || "Failed to delete tenant");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Tenants</h1>
        <Link to="/tenants/add" className="btn btn-primary flex items-center">
          <FaPlus className="mr-2" /> Add Tenant
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Room
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Joining Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tenants.map((tenant) => (
                <tr key={tenant._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {tenant.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col text-sm text-gray-900">
                      <div className="flex items-center">
                        <FaPhone className="text-gray-400 mr-1" size={12} />
                        {tenant.phone}
                      </div>
                      <div className="flex items-center mt-1">
                        <FaEnvelope className="text-gray-400 mr-1" size={12} />
                        {tenant.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Floor {tenant.roomId.floorNumber}, Room{" "}
                      {tenant.roomId.roomNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(tenant.joiningDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tenant.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tenant.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-3">
                      <Link
                        to={`/tenants/edit/${tenant._id}`}
                        className="flex items-center px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(tenant._id)}
                        className="flex items-center px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tenants;
