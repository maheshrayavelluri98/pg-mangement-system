import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaUserPlus,
  FaUser,
  FaBed,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch room details and tenants
  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      console.log("Fetching room details for ID:", id);

      // Fetch room details and tenants in parallel for better performance
      const [roomRes, tenantsRes] = await Promise.all([
        axios.get(`/rooms/${id}`),
        axios.get(`/tenants?roomId=${id}`),
      ]);

      // Process room data
      if (roomRes.data.success) {
        console.log("Room data fetched successfully");
        setRoom(roomRes.data.data);
      } else {
        console.error("Failed to fetch room details:", roomRes.data);
        toast.error("Failed to fetch room details");
        navigate("/rooms");
        return; // Exit early if room fetch fails
      }

      // Process tenants data
      if (tenantsRes.data.success) {
        console.log(
          `Fetched ${tenantsRes.data.data.length} tenants for this room`
        );
        setTenants(tenantsRes.data.data);
      } else {
        console.warn("No tenants found or error fetching tenants");
        setTenants([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching room details:", err);
      toast.error(err.response?.data?.error || "Failed to fetch room details");
      setLoading(false);
      navigate("/rooms");
    }
  };

  // Fetch room details when component mounts or when room ID changes
  const isMounted = useRef(false);

  useEffect(() => {
    // Skip the first render if not already mounted
    if (!isMounted.current) {
      isMounted.current = true;
      fetchRoomDetails();
    } else if (id) {
      // Only fetch again if the ID changes
      fetchRoomDetails();
    }

    // Cleanup function
    return () => {
      // Reset the mounted ref when component unmounts
      isMounted.current = false;
    };
  }, [id]); // Only depend on the ID

  const handleAddTenant = () => {
    navigate(`/tenants/add?roomId=${id}&returnToRoom=true`);
  };

  const handleDeleteTenant = async (tenantId) => {
    if (window.confirm("Are you sure you want to delete this tenant?")) {
      try {
        setLoading(true);
        const res = await axios.delete(`/tenants/${tenantId}`);

        if (res.data.success) {
          toast.success("Tenant deleted successfully");

          // Update local state instead of re-fetching everything
          // Remove the deleted tenant from the tenants array
          setTenants(tenants.filter((tenant) => tenant._id !== tenantId));

          // Update the room's occupiedBeds count
          if (room) {
            setRoom({
              ...room,
              occupiedBeds: Math.max(0, room.occupiedBeds - 1),
            });
          }
        } else {
          toast.error(res.data.error || "Failed to delete tenant");
        }
      } catch (err) {
        console.error("Error deleting tenant:", err);
        toast.error(err.response?.data?.error || "Failed to delete tenant");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading room details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Room not found
        </h2>
        <Link to="/rooms" className="btn btn-primary">
          Back to Rooms
        </Link>
      </div>
    );
  }

  // Generate beds based on room capacity
  const beds = Array.from({ length: room.capacity }, (_, index) => {
    // Find tenant for this bed if occupied
    const tenant = tenants[index] || null;
    return { id: index + 1, tenant };
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Room Details - Floor {room.floorNumber}, Room {room.roomNumber}
        </h1>
        <button
          onClick={() => navigate("/rooms")}
          className="btn btn-secondary flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Rooms
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Room Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Floor:</span>
                <span className="font-medium">{room.floorNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room Number:</span>
                <span className="font-medium">{room.roomNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-medium">
                  {room.capacity} {room.capacity > 1 ? "persons" : "person"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rent Amount:</span>
                <span className="font-medium">₹{room.rentAmount}/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Occupancy:</span>
                <span className="font-medium">
                  {room.occupiedBeds}/{room.capacity} beds occupied
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amenities:</span>
                <span className="font-medium">
                  {room.amenities.join(", ") || "None"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Bed Layout
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {beds.map((bed) => (
                <div
                  key={bed.id}
                  className={`border rounded-lg p-4 flex flex-col items-center justify-center shadow-md transition-all duration-300 hover:shadow-lg ${
                    bed.tenant
                      ? "bg-gradient-to-br from-red-50 to-red-100 border-red-300"
                      : "bg-gradient-to-br from-green-50 to-green-100 border-green-300"
                  }`}
                >
                  <div className="text-center mb-2">
                    <div className="flex justify-center mb-2">
                      {bed.tenant ? (
                        <FaUser className="h-8 w-8 text-red-500" />
                      ) : (
                        <FaBed className="h-8 w-8 text-green-500" />
                      )}
                    </div>
                    <h3 className="font-medium">Bed {bed.id}</h3>
                    {bed.tenant ? (
                      <div className="mt-2 text-sm">
                        <p className="font-semibold">{bed.tenant.name}</p>
                        <p className="text-gray-600">{bed.tenant.phone}</p>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <span className="px-2 py-1 bg-gradient-to-r from-green-400 to-green-500 text-white text-xs font-semibold rounded-full">
                          Vacant
                        </span>
                      </div>
                    )}
                  </div>
                  {bed.tenant ? (
                    <div className="mt-2 flex space-x-2">
                      <Link
                        to={`/tenants/edit/${bed.tenant._id}`}
                        className="px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-full shadow-sm flex items-center text-xs font-semibold transition-all duration-200 transform hover:scale-105"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteTenant(bed.tenant._id)}
                        className="px-3 py-1 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-full shadow-sm flex items-center text-xs font-semibold transition-all duration-200 transform hover:scale-105"
                        title="Remove tenant"
                      >
                        <FaTrash className="mr-1" /> Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleAddTenant}
                      className="mt-2 px-3 py-1 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-full shadow-sm flex items-center text-xs font-semibold transition-all duration-200 transform hover:scale-105"
                    >
                      <FaUserPlus className="mr-1" /> Add Tenant
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {room.description && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-2">
              Description
            </h2>
            <p className="text-gray-600">{room.description}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Current Tenants
        </h2>
        {tenants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joining Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      <div className="text-sm text-gray-500">
                        {tenant.phone}
                      </div>
                      <div className="text-sm text-gray-500">
                        {tenant.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          to={`/tenants/edit/${tenant._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleDeleteTenant(tenant._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete tenant"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No tenants in this room yet.</p>
            <button
              onClick={handleAddTenant}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white rounded-full shadow-md flex items-center mx-auto font-semibold transition-all duration-200 transform hover:scale-105"
            >
              <FaUserPlus className="mr-2" /> Add Tenant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetails;
