import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaSave,
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaToggleOn,
  FaUserFriends,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useRooms } from "../context/RoomContext";

const TenantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!id;
  const { fetchRooms } = useRooms(); // Get fetchRooms from RoomContext

  // Get roomId from URL query parameter if available
  const queryParams = new URLSearchParams(location.search);
  const preselectedRoomId = queryParams.get("roomId");
  const returnToRoom = queryParams.get("returnToRoom") === "true";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    emergencyContact: {
      name: "",
      phone: "",
      relation: "",
    },
    idProofType: "Aadhar",
    idProofNumber: "",
    occupation: "",
    roomId: preselectedRoomId || "",
    joiningDate: new Date().toISOString().split("T")[0],
    active: true,
  });

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const formRef = useRef(null);

  const {
    name,
    email,
    phone,
    emergencyContact,
    idProofType,
    idProofNumber,
    occupation,
    roomId,
    joiningDate,
    active,
  } = formData;

  const idProofTypes = [
    "Aadhar",
    "PAN",
    "Driving License",
    "Passport",
    "Voter ID",
    "Other",
  ];

  // Animation effect for form fields
  useEffect(() => {
    if (!fetchLoading && formRef.current) {
      const formGroups = formRef.current.querySelectorAll(
        ".premium-tenant-form-group"
      );

      formGroups.forEach((group, index) => {
        group.style.opacity = "0";
        group.style.transform = "translateY(20px)";
        group.style.transition = "all 0.4s ease";

        setTimeout(() => {
          group.style.opacity = "1";
          group.style.transform = "translateY(0)";
        }, 100 + index * 50); // Staggered animation
      });
    }
  }, [fetchLoading]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("/rooms");
        if (res.data.success) {
          setRooms(res.data.data);
        } else {
          setRooms([]);
          toast.error("Failed to fetch available rooms");
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
        toast.error("Failed to fetch available rooms");
        setRooms([]);
      }
    };

    const fetchTenant = async () => {
      if (isEditMode) {
        try {
          const res = await axios.get(`/tenants/${id}`);
          if (res.data.success) {
            // Format the joining date to YYYY-MM-DD for the date input
            const tenant = res.data.data;
            if (tenant.joiningDate) {
              tenant.joiningDate = new Date(tenant.joiningDate)
                .toISOString()
                .split("T")[0];
            }
            setFormData(tenant);
          } else {
            toast.error("Failed to fetch tenant details");
          }
          setFetchLoading(false);
        } catch (err) {
          console.error("Error fetching tenant:", err);
          toast.error(
            err.response?.data?.error || "Failed to fetch tenant details"
          );
          setFetchLoading(false);
        }
      }
    };

    fetchRooms();
    fetchTenant();
  }, [id, isEditMode]);

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("emergency")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        emergencyContact: {
          ...emergencyContact,
          [field]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (isEditMode) {
        res = await axios.put(`/tenants/${id}`, formData);
      } else {
        res = await axios.post("/tenants", formData);
      }

      if (res.data.success) {
        // Refresh rooms data to update occupancy status immediately
        await fetchRooms();

        toast.success(
          `Tenant ${isEditMode ? "updated" : "created"} successfully`
        );

        // If we came from a room details page and have a preselected room,
        // navigate back to that room's details page
        if (returnToRoom && preselectedRoomId) {
          // Add a small delay to ensure the room data is refreshed before navigating
          setTimeout(() => {
            navigate(`/rooms/details/${preselectedRoomId}`);
          }, 300);
        } else {
          navigate("/tenants");
        }
      } else {
        toast.error(
          res.data.error ||
            `Failed to ${isEditMode ? "update" : "create"} tenant`
        );
      }
    } catch (err) {
      console.error("Error saving tenant:", err);
      toast.error(
        err.response?.data?.error ||
          `Failed to ${isEditMode ? "update" : "create"} tenant`
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="premium-tenant-loading">
        <div className="premium-tenant-spinner"></div>
      </div>
    );
  }

  return (
    <div className="premium-tenant-container">
      <div className="premium-tenant-header">
        <h1 className="premium-tenant-title">
          {isEditMode ? "Edit Tenant" : "Add New Tenant"}
        </h1>
        <button
          onClick={() => navigate("/tenants")}
          className="premium-tenant-back"
        >
          <FaArrowLeft className="premium-tenant-back-icon" /> Back to Tenants
        </button>
      </div>

      {preselectedRoomId && (
        <div className="premium-tenant-alert">
          <div className="flex items-center">
            <FaCheckCircle className="mr-2" size={18} />
            <div>
              <p className="premium-tenant-alert-title">
                Room pre-selected from Rooms page
              </p>
              <p className="premium-tenant-alert-text">
                You can change the room if needed.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="premium-tenant-form-card">
        <div className="premium-tenant-form-body">
          <form onSubmit={onSubmit} ref={formRef}>
            <div className="premium-tenant-form-grid">
              <div className="premium-tenant-form-group">
                <label htmlFor="name" className="premium-tenant-form-label">
                  <FaUser className="inline-block mr-2" /> Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  className="premium-tenant-form-input"
                  required
                  placeholder="Enter tenant's full name"
                />
              </div>

              <div className="premium-tenant-form-group">
                <label htmlFor="email" className="premium-tenant-form-label">
                  <FaEnvelope className="inline-block mr-2" /> Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="premium-tenant-form-input"
                  placeholder="Enter email address (optional)"
                />
              </div>

              <div className="premium-tenant-form-group">
                <label htmlFor="phone" className="premium-tenant-form-label">
                  <FaPhone className="inline-block mr-2" /> Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={onChange}
                  className="premium-tenant-form-input"
                  required
                  placeholder="Enter phone number"
                />
              </div>

              <div className="premium-tenant-form-group">
                <label
                  htmlFor="occupation"
                  className="premium-tenant-form-label"
                >
                  <FaBriefcase className="inline-block mr-2" /> Occupation
                </label>
                <input
                  type="text"
                  id="occupation"
                  name="occupation"
                  value={occupation}
                  onChange={onChange}
                  className="premium-tenant-form-input"
                  placeholder="Enter occupation (optional)"
                />
              </div>

              <div className="premium-tenant-form-group">
                <label
                  htmlFor="idProofType"
                  className="premium-tenant-form-label"
                >
                  <FaIdCard className="inline-block mr-2" /> ID Proof Type
                </label>
                <select
                  id="idProofType"
                  name="idProofType"
                  value={idProofType}
                  onChange={onChange}
                  className="premium-tenant-form-select"
                  required
                >
                  {idProofTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="premium-tenant-form-group">
                <label
                  htmlFor="idProofNumber"
                  className="premium-tenant-form-label"
                >
                  <FaIdCard className="inline-block mr-2" /> ID Proof Number
                </label>
                <input
                  type="text"
                  id="idProofNumber"
                  name="idProofNumber"
                  value={idProofNumber}
                  onChange={onChange}
                  className="premium-tenant-form-input"
                  required
                  placeholder="Enter ID proof number"
                />
              </div>

              <div className="premium-tenant-form-group">
                <label htmlFor="roomId" className="premium-tenant-form-label">
                  <FaBuilding className="inline-block mr-2" /> Room
                </label>
                <select
                  id="roomId"
                  name="roomId"
                  value={roomId}
                  onChange={onChange}
                  className={`premium-tenant-form-select ${
                    preselectedRoomId ? "border-green-500 bg-green-50" : ""
                  }`}
                  required
                  style={{
                    transition: "all 0.3s ease",
                    borderColor: preselectedRoomId ? "#10b981" : "",
                    boxShadow: preselectedRoomId
                      ? "0 0 0 3px rgba(16, 185, 129, 0.1)"
                      : "",
                  }}
                >
                  <option value="">Select a room</option>
                  {rooms.map((room) => (
                    <option
                      key={room._id}
                      value={room._id}
                      disabled={
                        room.occupiedBeds >= room.capacity &&
                        room._id !== roomId
                      }
                      style={{
                        backgroundColor:
                          room._id === preselectedRoomId ? "#d1fae5" : "",
                        fontWeight: room._id === preselectedRoomId ? "600" : "",
                        padding: "8px",
                      }}
                    >
                      Floor {room.floorNumber}, Room {room.roomNumber}
                      {room.occupiedBeds > 0
                        ? ` (${room.occupiedBeds}/${room.capacity} occupied)`
                        : " (Vacant)"}
                      {room._id === preselectedRoomId
                        ? " ← Selected from Rooms page"
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="premium-tenant-form-group">
                <label
                  htmlFor="joiningDate"
                  className="premium-tenant-form-label"
                >
                  <FaCalendarAlt className="inline-block mr-2" /> Joining Date
                </label>
                <input
                  type="date"
                  id="joiningDate"
                  name="joiningDate"
                  value={joiningDate}
                  onChange={onChange}
                  className="premium-tenant-form-input"
                  required
                />
              </div>

              {isEditMode && (
                <div className="premium-tenant-form-group">
                  <label htmlFor="active" className="premium-tenant-form-label">
                    <FaToggleOn className="inline-block mr-2" /> Status
                  </label>
                  <select
                    id="active"
                    name="active"
                    value={active.toString()}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        active: e.target.value === "true",
                      })
                    }
                    className="premium-tenant-form-select"
                    style={{
                      borderColor: active ? "#10b981" : "#ef4444",
                      backgroundColor: active
                        ? "rgba(16, 185, 129, 0.05)"
                        : "rgba(239, 68, 68, 0.05)",
                    }}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              )}
            </div>

            <div className="premium-tenant-form-divider">
              <span className="premium-tenant-form-divider-title">
                <FaUserFriends className="inline-block mr-2" /> Emergency
                Contact
              </span>
              <div
                className="premium-tenant-form-grid"
                style={{ marginTop: "1.5rem" }}
              >
                <div className="premium-tenant-form-group">
                  <label
                    htmlFor="emergency.name"
                    className="premium-tenant-form-label"
                  >
                    <FaUser className="inline-block mr-2" /> Name
                  </label>
                  <input
                    type="text"
                    id="emergency.name"
                    name="emergency.name"
                    value={emergencyContact.name}
                    onChange={onChange}
                    className="premium-tenant-form-input"
                    placeholder="Enter emergency contact name"
                  />
                </div>

                <div className="premium-tenant-form-group">
                  <label
                    htmlFor="emergency.phone"
                    className="premium-tenant-form-label"
                  >
                    <FaPhone className="inline-block mr-2" /> Phone Number
                  </label>
                  <input
                    type="text"
                    id="emergency.phone"
                    name="emergency.phone"
                    value={emergencyContact.phone}
                    onChange={onChange}
                    className="premium-tenant-form-input"
                    placeholder="Enter emergency contact phone"
                  />
                </div>

                <div className="premium-tenant-form-group">
                  <label
                    htmlFor="emergency.relation"
                    className="premium-tenant-form-label"
                  >
                    <FaInfoCircle className="inline-block mr-2" /> Relation
                  </label>
                  <input
                    type="text"
                    id="emergency.relation"
                    name="emergency.relation"
                    value={emergencyContact.relation}
                    onChange={onChange}
                    className="premium-tenant-form-input"
                    placeholder="Enter relation (e.g., Parent, Sibling)"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="premium-tenant-submit-btn"
              >
                <FaSave className="premium-tenant-submit-icon" />
                {loading ? "Saving..." : "Save Tenant"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TenantForm;
