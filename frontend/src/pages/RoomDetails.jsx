import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaUserPlus,
  FaUser,
  FaBed,
  FaTrash,
  FaEdit,
  FaInfoCircle,
  FaBuilding,
  FaRupeeSign,
  FaUsers,
  FaLayerGroup,
  FaListUl,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaEye,
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
      <div className="premium-loading">
        <div className="premium-spinner"></div>
        <p className="premium-loading-text">Loading room details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="premium-not-found">
        <FaExclamationCircle size={48} className="text-gray-400 mb-4" />
        <h2 className="premium-not-found-title">Room not found</h2>
        <Link
          to="/rooms"
          className="premium-action-btn premium-action-btn-primary"
        >
          <FaArrowLeft className="premium-action-btn-icon" /> Back to Rooms
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
    <div className="premium-details-container">
      <div className="premium-details-header">
        <h1 className="premium-details-title">
          Room Details - Floor {room.floorNumber}, Room {room.roomNumber}
        </h1>
        <button
          onClick={() => navigate("/rooms")}
          className="premium-details-back"
        >
          <FaArrowLeft className="premium-details-back-icon" /> Back to Rooms
        </button>
      </div>

      <div className="premium-grid">
        <div className="premium-details-card">
          <div className="premium-details-card-body">
            <h2 className="premium-details-section-title">
              <FaInfoCircle className="premium-details-section-icon" />
              Room Information
            </h2>
            <div className="premium-details-info-list">
              <div className="premium-details-info-item">
                <span className="premium-details-info-label">
                  <FaBuilding className="premium-details-info-icon" />
                  Floor
                </span>
                <span className="premium-details-info-value">
                  {room.floorNumber}
                </span>
              </div>
              <div className="premium-details-info-item">
                <span className="premium-details-info-label">
                  <FaBuilding className="premium-details-info-icon" />
                  Room Number
                </span>
                <span className="premium-details-info-value">
                  {room.roomNumber}
                </span>
              </div>
              <div className="premium-details-info-item">
                <span className="premium-details-info-label">
                  <FaUsers className="premium-details-info-icon" />
                  Capacity
                </span>
                <span className="premium-details-info-value">
                  {room.capacity} {room.capacity > 1 ? "persons" : "person"}
                </span>
              </div>
              <div className="premium-details-info-item">
                <span className="premium-details-info-label">
                  <FaRupeeSign className="premium-details-info-icon" />
                  Rent Amount
                </span>
                <span className="premium-details-info-value">
                  ₹{room.rentAmount}/month
                </span>
              </div>
              <div className="premium-details-info-item">
                <span className="premium-details-info-label">
                  <FaBed className="premium-details-info-icon" />
                  Occupancy
                </span>
                <span className="premium-details-info-value">
                  {room.occupiedBeds}/{room.capacity} beds occupied
                </span>
              </div>
              <div className="premium-details-info-item">
                <span className="premium-details-info-label">
                  <FaListUl className="premium-details-info-icon" />
                  Amenities
                </span>
                <span className="premium-details-info-value">
                  {room.amenities.length > 0
                    ? room.amenities.join(", ")
                    : "None"}
                </span>
              </div>
            </div>

            {room.description && (
              <div className="premium-description">
                <h3 className="premium-details-section-title">
                  <FaInfoCircle className="premium-details-section-icon" />
                  Description
                </h3>
                <p className="premium-description-text">{room.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="premium-details-card">
          <div className="premium-details-card-body">
            <h2 className="premium-details-section-title">
              <FaLayerGroup className="premium-details-section-icon" />
              Bed Layout
            </h2>
            <div className="premium-details-beds">
              {beds.map((bed) => (
                <div
                  key={bed.id}
                  className={`premium-bed-card ${
                    bed.tenant ? "premium-bed-occupied" : "premium-bed-vacant"
                  }`}
                >
                  <div className="premium-bed-icon-container">
                    {bed.tenant ? (
                      <FaUser className="premium-bed-icon" />
                    ) : (
                      <FaBed className="premium-bed-icon" />
                    )}
                  </div>
                  <h3 className="premium-bed-title">Bed {bed.id}</h3>

                  {bed.tenant ? (
                    <>
                      <div className="premium-bed-status">
                        <FaUser className="mr-2" /> Occupied
                      </div>
                      <div className="premium-tenant-info">
                        <p className="premium-tenant-name">{bed.tenant.name}</p>
                        <p className="premium-tenant-phone">
                          <FaPhone size={12} className="mr-1" />
                          {bed.tenant.phone}
                        </p>
                      </div>
                      <div className="premium-bed-actions">
                        <Link
                          to={`/tenants/edit/${bed.tenant._id}`}
                          className="premium-action-btn premium-action-btn-primary"
                          style={{
                            transform: "translateY(0)",
                            transition: "transform 0.4s ease",
                            transitionDelay: "0.1s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-5px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          <FaEdit className="premium-action-btn-icon" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteTenant(bed.tenant._id)}
                          className="premium-action-btn premium-action-btn-danger"
                          title="Remove tenant"
                          style={{
                            transform: "translateY(0)",
                            transition: "transform 0.4s ease",
                            transitionDelay: "0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-5px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          <FaTrash className="premium-action-btn-icon" /> Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="premium-bed-status">
                        <FaBed className="mr-2" /> Vacant
                      </div>
                      <button
                        onClick={handleAddTenant}
                        className="premium-action-btn premium-action-btn-primary"
                        style={{
                          transform: "translateY(0)",
                          transition:
                            "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(-5px) scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(0) scale(1)";
                        }}
                      >
                        <FaUserPlus
                          className="premium-action-btn-icon"
                          style={{
                            transition: "transform 0.4s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "rotate(15deg)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "rotate(0)";
                          }}
                        />
                        Add Tenant
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="premium-details-card" style={{ animationDelay: "0.3s" }}>
        <div className="premium-details-card-body">
          <h2 className="premium-details-section-title">
            <FaUsers className="premium-details-section-icon" />
            Current Tenants
          </h2>

          {tenants.length > 0 ? (
            <div className="premium-tenants-table-container">
              <table className="premium-tenants-table">
                <thead className="premium-tenants-table-header">
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Joined Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="premium-tenants-table-body">
                  {tenants.map((tenant) => (
                    <tr key={tenant._id}>
                      <td className="premium-tenant-name-cell">
                        {tenant.name}
                      </td>
                      <td>
                        <div className="premium-tenant-contact-cell">
                          <div className="premium-tenant-phone-text">
                            <FaPhone size={12} className="inline mr-1" />{" "}
                            {tenant.phone}
                          </div>
                          {tenant.email && (
                            <div className="premium-tenant-email-text">
                              <FaEnvelope size={12} className="inline mr-1" />{" "}
                              {tenant.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="premium-tenant-date-cell">
                        <FaCalendarAlt size={12} className="inline mr-1" />
                        {new Date(tenant.joiningDate).toLocaleDateString()}
                      </td>
                      <td>
                        <span
                          className={`premium-status-badge ${
                            tenant.active
                              ? "premium-status-active"
                              : "premium-status-inactive"
                          }`}
                        >
                          {tenant.active ? (
                            <>
                              <FaCheckCircle
                                size={12}
                                className="inline mr-1"
                              />{" "}
                              Active
                            </>
                          ) : (
                            <>
                              <FaTimesCircle
                                size={12}
                                className="inline mr-1"
                              />{" "}
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td>
                        <div className="premium-table-actions">
                          <Link
                            to={`/tenants/edit/${tenant._id}`}
                            className="premium-table-action-link"
                          >
                            <FaEye size={14} /> View
                          </Link>
                          <button
                            onClick={() => handleDeleteTenant(tenant._id)}
                            className="premium-table-action-delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="premium-empty-state">
              <FaExclamationCircle size={36} className="premium-empty-icon" />
              <p className="premium-empty-text">No tenants in this room yet.</p>
              <button
                onClick={handleAddTenant}
                className="premium-action-btn premium-action-btn-primary"
              >
                <FaUserPlus className="premium-action-btn-icon" /> Add Tenant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
