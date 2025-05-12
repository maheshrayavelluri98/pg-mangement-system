import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaBed,
  FaUsers,
  FaRupeeSign,
  FaWifi,
  FaSnowflake,
  FaTv,
  FaShower,
  FaChair,
  FaToilet,
  FaUtensils,
  FaFan,
  FaCouch,
  FaArchway,
  FaWarehouse,
  FaDoorOpen,
  FaListUl,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";

// Mapping of amenity names to icons
const amenityIcons = {
  AC: <FaSnowflake />,
  TV: <FaTv />,
  WiFi: <FaWifi />,
  Geyser: <FaShower />,
  Refrigerator: <FaSnowflake />,
  "Washing Machine": <FaFan />,
  Cupboard: <FaWarehouse />,
  "Study Table": <FaChair />,
  Chair: <FaChair />,
  Bed: <FaBed />,
  Washroom: <FaToilet />,
  Kitchen: <FaUtensils />,
  Fan: <FaFan />,
  Sofa: <FaCouch />,
  Balcony: <FaArchway />,
  Cooler: <FaSnowflake />,
  Curtains: <FaArchway />,
  "Table Chair": <FaChair />,
  Almirah: <FaWarehouse />,
  Mattress: <FaBed />,
};

const RoomCard = ({ room, onDelete, onViewRoom, onVacantRoomClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    _id,
    floorNumber,
    roomNumber,
    capacity,
    rentAmount,
    occupiedBeds,
    amenities,
  } = room;

  // Determine room status
  const isVacant = occupiedBeds === 0;
  const isFull = occupiedBeds >= capacity;
  const isPartiallyOccupied = !isVacant && !isFull;

  // Get status class and text
  const getStatusClass = () => {
    if (isVacant) return "status-vacant";
    if (isPartiallyOccupied) return "status-partial";
    return "status-full";
  };

  const getStatusText = () => {
    if (isVacant) return "Vacant";
    if (isPartiallyOccupied) return "Partially Occupied";
    return "Full";
  };

  // Get status icon
  const getStatusIcon = () => {
    if (isVacant) return <FaCheckCircle className="mr-2 text-white" />;
    if (isPartiallyOccupied)
      return <FaExclamationCircle className="mr-2 text-white" />;
    return <FaTimesCircle className="mr-2 text-white" />;
  };

  // Handle click on room card
  const handleCardClick = () => {
    if (isVacant) {
      onVacantRoomClick(_id);
    } else {
      onViewRoom(_id);
    }
  };

  // Handle mouse events
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Handle delete with confirmation
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent card click
    if (window.confirm("Are you sure you want to delete this room?")) {
      onDelete(_id);
    }
  };

  // Prevent propagation for edit button
  const handleEdit = (e) => {
    e.stopPropagation();
  };

  // Display only first 3 amenities + count of remaining
  const displayAmenities = () => {
    if (!amenities || amenities.length === 0) {
      return <span className="text-gray-400 text-xs italic">No amenities</span>;
    }

    const visibleAmenities = amenities.slice(0, 3);
    const remainingCount = amenities.length - 3;

    return (
      <div className="room-card-amenities-list">
        {visibleAmenities.map((amenity, index) => (
          <span
            key={amenity}
            className="room-card-amenity"
            style={{
              transitionDelay: `${index * 0.05}s`,
            }}
          >
            <span className="room-card-amenity-icon">
              {amenityIcons[amenity] || <FaBed />}
            </span>
            {amenity}
          </span>
        ))}
        {remainingCount > 0 && (
          <span
            className="room-card-amenity"
            style={{
              transitionDelay: `${visibleAmenities.length * 0.05}s`,
            }}
          >
            <span className="room-card-amenity-icon">
              <FaListUl />
            </span>
            +{remainingCount} more
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className="room-card"
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="room-card-header">
        <h3 className="room-card-title">
          <FaDoorOpen className="room-card-title-icon" />
          <span className="text-white font-semibold">
            Floor {floorNumber}, Room {roomNumber}
          </span>
        </h3>
        <div className="room-card-subtitle">
          <div className="flex items-center bg-white/20 px-2 py-1 rounded-md">
            <FaUsers className="mr-1 text-white" />
            <span>
              {capacity} {capacity > 1 ? "Persons" : "Person"}
            </span>
          </div>
          <div className="flex items-center bg-white/20 px-2 py-1 rounded-md">
            <FaRupeeSign className="mr-1 text-white" />
            <span>₹{rentAmount}/Month</span>
          </div>
        </div>
      </div>

      <div className="room-card-body">
        <div className="room-card-info">
          <div className="room-card-info-item">
            <div className="room-card-info-icon">
              <FaUsers />
            </div>
            <div className="room-card-info-label">Capacity</div>
            <div className="room-card-info-value">
              {capacity} {capacity > 1 ? "Persons" : "Person"}
            </div>
          </div>

          <div className="room-card-info-item">
            <div className="room-card-info-icon">
              <FaBed />
            </div>
            <div className="room-card-info-label">Occupied</div>
            <div className="room-card-info-value">
              {occupiedBeds} of {capacity} beds
            </div>
          </div>

          <div className="room-card-info-item">
            <div className="room-card-info-icon">
              <FaRupeeSign />
            </div>
            <div className="room-card-info-label">Rent</div>
            <div className="room-card-info-value">₹{rentAmount}/Month</div>
          </div>
        </div>

        <div className="room-card-amenities">
          <h4 className="room-card-amenities-title">
            <FaListUl className="room-card-amenities-icon" />
            Amenities
          </h4>
          {displayAmenities()}
        </div>
      </div>

      <div className="room-card-status">
        <div className={`status-badge ${getStatusClass()}`}>
          <div className="flex items-center justify-center w-full">
            {getStatusIcon()}
            <span>
              {occupiedBeds}/{capacity} - {getStatusText()}
            </span>
          </div>
        </div>
      </div>

      <div className="room-card-actions">
        <Link
          to={`/rooms/edit/${_id}`}
          className="room-card-btn room-card-btn-edit"
          onClick={handleEdit}
        >
          <FaEdit className="room-card-btn-icon" />
          Edit
        </Link>
        <button
          className="room-card-btn room-card-btn-delete"
          onClick={handleDelete}
        >
          <FaTrash className="room-card-btn-icon" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
