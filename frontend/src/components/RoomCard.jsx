import React from "react";
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
  FaWarehouse
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
  const { _id, floorNumber, roomNumber, capacity, rentAmount, occupiedBeds, amenities } = room;

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

  // Handle click on room card
  const handleCardClick = () => {
    if (isVacant) {
      onVacantRoomClick(_id);
    } else {
      onViewRoom(_id);
    }
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
        {visibleAmenities.map((amenity) => (
          <span key={amenity} className="room-card-amenity">
            <span className="room-card-amenity-icon">
              {amenityIcons[amenity] || <FaBed />}
            </span>
            {amenity}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="room-card-amenity">
            +{remainingCount} more
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="room-card" onClick={handleCardClick}>
      <div className="room-card-header">
        <h3 className="room-card-title">
          Floor {floorNumber}, Room {roomNumber}
        </h3>
        <div className="room-card-subtitle">
          <div className="flex items-center">
            <FaUsers className="mr-1" />
            <span>{capacity} {capacity > 1 ? "persons" : "person"}</span>
          </div>
          <div className="flex items-center">
            <FaRupeeSign className="mr-1" />
            <span>{rentAmount}/month</span>
          </div>
        </div>
      </div>
      
      <div className="room-card-body">
        <div className="room-card-amenities">
          <h4 className="room-card-amenities-title">Amenities</h4>
          {displayAmenities()}
        </div>
      </div>
      
      <div className="room-card-status">
        <div className={`status-badge ${getStatusClass()}`}>
          <span>{occupiedBeds}/{capacity} - {getStatusText()}</span>
        </div>
      </div>
      
      <div className="room-card-actions">
        <Link 
          to={`/rooms/edit/${_id}`} 
          className="room-card-btn room-card-btn-edit"
          onClick={handleEdit}
        >
          <FaEdit className="room-card-btn-icon" /> Edit
        </Link>
        <button 
          className="room-card-btn room-card-btn-delete"
          onClick={handleDelete}
        >
          <FaTrash className="room-card-btn-icon" /> Delete
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
