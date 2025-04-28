import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import { useRooms } from "../context/RoomContext";

const RoomForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { getRoom, addRoom, updateRoom } = useRooms();

  const [formData, setFormData] = useState({
    floorNumber: "",
    roomNumber: "",
    capacity: 1,
    rentAmount: "",
    amenities: [],
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);

  const {
    floorNumber,
    roomNumber,
    capacity,
    rentAmount,
    amenities,
    description,
  } = formData;

  // Available amenities options
  const amenitiesOptions = [
    "AC",
    "TV",
    "WiFi",
    "Geyser",
    "Refrigerator",
    "Washing Machine",
    "Cupboard",
    "Study Table",
    "Balcony",
  ];

  useEffect(() => {
    if (isEditMode) {
      const room = getRoom(id);
      if (room) {
        setFormData({
          floorNumber: room.floorNumber,
          roomNumber: room.roomNumber,
          capacity: room.capacity,
          rentAmount: room.rentAmount,
          amenities: room.amenities || [],
          description: room.description || "",
        });
      }
      setFetchLoading(false);
    }
  }, [id, isEditMode, getRoom]);

  const onChange = (e) => {
    if (e.target.name === "amenities") {
      const value = e.target.value;
      if (e.target.checked) {
        setFormData({ ...formData, amenities: [...amenities, value] });
      } else {
        setFormData({
          ...formData,
          amenities: amenities.filter((amenity) => amenity !== value),
        });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        await updateRoom(id, formData);
      } else {
        await addRoom(formData);
      }
      setLoading(false);
      navigate("/rooms");
    } catch (err) {
      console.error("Error saving room:", err);
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
          {isEditMode ? "Edit Room" : "Add New Room"}
        </h1>
        <button
          onClick={() => navigate("/rooms")}
          className="btn btn-secondary flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Rooms
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="floorNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Floor Number
              </label>
              <input
                type="number"
                id="floorNumber"
                name="floorNumber"
                value={floorNumber}
                onChange={onChange}
                className="form-input"
                required
                min="0"
              />
            </div>

            <div>
              <label
                htmlFor="roomNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Room Number
              </label>
              <input
                type="text"
                id="roomNumber"
                name="roomNumber"
                value={roomNumber}
                onChange={onChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Capacity (persons)
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={capacity}
                onChange={onChange}
                className="form-input"
                required
                min="1"
              />
            </div>

            <div>
              <label
                htmlFor="rentAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Rent Amount (₹/month)
              </label>
              <input
                type="number"
                id="rentAmount"
                name="rentAmount"
                value={rentAmount}
                onChange={onChange}
                className="form-input"
                required
                min="0"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {amenitiesOptions.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`amenity-${option}`}
                    name="amenities"
                    value={option}
                    checked={amenities.includes(option)}
                    onChange={onChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`amenity-${option}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={onChange}
              rows="3"
              className="form-input"
            ></textarea>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex items-center justify-center w-full md:w-auto"
            >
              <FaSave className="mr-2" />
              {loading ? "Saving..." : "Save Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;
