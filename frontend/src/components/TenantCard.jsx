import React from "react";
import { Link } from "react-router-dom";
import { 
  FaEdit, 
  FaTrash, 
  FaPhone, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaBuilding,
  FaIdCard,
  FaBriefcase,
  FaUserCircle
} from "react-icons/fa";

const TenantCard = ({ tenant, onDelete }) => {
  const { 
    _id, 
    name, 
    phone, 
    email, 
    roomId, 
    joiningDate, 
    active, 
    idProofType, 
    occupation 
  } = tenant;

  // Format joining date
  const formattedDate = new Date(joiningDate).toLocaleDateString();

  // Handle delete with confirmation
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this tenant?")) {
      onDelete(_id);
    }
  };

  return (
    <div className="tenant-card">
      <div className="tenant-card-header">
        <h3 className="tenant-card-title">{name}</h3>
      </div>
      
      <div className="tenant-card-body">
        <div className="tenant-card-info">
          <div className="tenant-card-info-item">
            <div className="tenant-card-info-icon">
              <FaPhone />
            </div>
            <div className="tenant-card-info-label">Phone:</div>
            <div className="tenant-card-info-value">{phone}</div>
          </div>
          
          <div className="tenant-card-info-item">
            <div className="tenant-card-info-icon">
              <FaEnvelope />
            </div>
            <div className="tenant-card-info-label">Email:</div>
            <div className="tenant-card-info-value">{email || "N/A"}</div>
          </div>
          
          <div className="tenant-card-info-item">
            <div className="tenant-card-info-icon">
              <FaBuilding />
            </div>
            <div className="tenant-card-info-label">Room:</div>
            <div className="tenant-card-info-value">
              Floor {roomId.floorNumber}, Room {roomId.roomNumber}
            </div>
          </div>
          
          <div className="tenant-card-info-item">
            <div className="tenant-card-info-icon">
              <FaCalendarAlt />
            </div>
            <div className="tenant-card-info-label">Joined:</div>
            <div className="tenant-card-info-value">{formattedDate}</div>
          </div>
          
          <div className="tenant-card-info-item">
            <div className="tenant-card-info-icon">
              <FaIdCard />
            </div>
            <div className="tenant-card-info-label">ID Type:</div>
            <div className="tenant-card-info-value">{idProofType}</div>
          </div>
          
          {occupation && (
            <div className="tenant-card-info-item">
              <div className="tenant-card-info-icon">
                <FaBriefcase />
              </div>
              <div className="tenant-card-info-label">Occupation:</div>
              <div className="tenant-card-info-value">{occupation}</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="tenant-card-status">
        <div className={`tenant-status-badge ${active ? "tenant-status-active" : "tenant-status-inactive"}`}>
          <FaUserCircle className="mr-1" />
          <span>{active ? "Active" : "Inactive"}</span>
        </div>
      </div>
      
      <div className="tenant-card-actions">
        <Link 
          to={`/tenants/edit/${_id}`} 
          className="tenant-card-btn tenant-card-btn-edit"
        >
          <FaEdit className="tenant-card-btn-icon" /> Edit
        </Link>
        <button 
          className="tenant-card-btn tenant-card-btn-delete"
          onClick={handleDelete}
        >
          <FaTrash className="tenant-card-btn-icon" /> Delete
        </button>
      </div>
    </div>
  );
};

export default TenantCard;
