import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const TenantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = !!id;

  // Get roomId from URL query parameter if available
  const queryParams = new URLSearchParams(location.search);
  const preselectedRoomId = queryParams.get("roomId");

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
        toast.success(
          `Tenant ${isEditMode ? "updated" : "created"} successfully`
        );
        navigate("/tenants");
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {isEditMode ? "Edit Tenant" : "Add New Tenant"}
        </h1>
        <button
          onClick={() => navigate("/tenants")}
          className="btn btn-secondary flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Tenants
        </button>
      </div>

      {preselectedRoomId && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md">
          <div className="flex items-center">
            <div className="py-1">
              <p className="font-semibold">Room pre-selected from Rooms page</p>
              <p className="text-sm">You can change the room if needed.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                className="form-input"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={phone}
                onChange={onChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label
                htmlFor="occupation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Occupation
              </label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={occupation}
                onChange={onChange}
                className="form-input"
              />
            </div>

            <div>
              <label
                htmlFor="idProofType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ID Proof Type
              </label>
              <select
                id="idProofType"
                name="idProofType"
                value={idProofType}
                onChange={onChange}
                className="form-input"
                required
              >
                {idProofTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="idProofNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ID Proof Number
              </label>
              <input
                type="text"
                id="idProofNumber"
                name="idProofNumber"
                value={idProofNumber}
                onChange={onChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label
                htmlFor="roomId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Room
              </label>
              <select
                id="roomId"
                name="roomId"
                value={roomId}
                onChange={onChange}
                className={`form-input ${
                  preselectedRoomId ? "border-green-500 bg-green-50" : ""
                }`}
                required
              >
                <option value="">Select a room</option>
                {rooms.map((room) => (
                  <option
                    key={room._id}
                    value={room._id}
                    disabled={
                      room.occupiedBeds >= room.capacity && room._id !== roomId
                    }
                    className={
                      room._id === preselectedRoomId
                        ? "bg-green-100 font-semibold"
                        : ""
                    }
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

            <div>
              <label
                htmlFor="joiningDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Joining Date
              </label>
              <input
                type="date"
                id="joiningDate"
                name="joiningDate"
                value={joiningDate}
                onChange={onChange}
                className="form-input"
                required
              />
            </div>

            {isEditMode && (
              <div>
                <label
                  htmlFor="active"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
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
                  className="form-input"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Emergency Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="emergency.name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="emergency.name"
                  name="emergency.name"
                  value={emergencyContact.name}
                  onChange={onChange}
                  className="form-input"
                />
              </div>

              <div>
                <label
                  htmlFor="emergency.phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="emergency.phone"
                  name="emergency.phone"
                  value={emergencyContact.phone}
                  onChange={onChange}
                  className="form-input"
                />
              </div>

              <div>
                <label
                  htmlFor="emergency.relation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Relation
                </label>
                <input
                  type="text"
                  id="emergency.relation"
                  name="emergency.relation"
                  value={emergencyContact.relation}
                  onChange={onChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center justify-center w-full md:w-auto"
            >
              <FaSave className="mr-2" />
              {loading ? "Saving..." : "Save Tenant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantForm;
