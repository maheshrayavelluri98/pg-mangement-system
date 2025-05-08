import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import { useRooms } from "../context/RoomContext";
import RoomCard from "../components/RoomCard";

const Rooms = () => {
  const { rooms, loading, deleteRoom } = useRooms();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleViewRoom = (roomId) => {
    navigate(`/rooms/details/${roomId}`);
  };

  // Function to handle clicking on a vacant room
  const handleVacantRoomClick = (roomId) => {
    navigate(`/tenants/add?roomId=${roomId}&returnToRoom=true`);
  };

  const handleDelete = async (id) => {
    await deleteRoom(id);
  };

  // Filter and search rooms
  const filteredRooms = rooms.filter((room) => {
    // Search by floor number or room number
    const matchesSearch =
      searchTerm === "" ||
      `Floor ${room.floorNumber}, Room ${room.roomNumber}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Filter by status
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "vacant" && room.occupiedBeds === 0) ||
      (filterStatus === "partial" &&
        room.occupiedBeds > 0 &&
        room.occupiedBeds < room.capacity) ||
      (filterStatus === "full" && room.occupiedBeds >= room.capacity);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading rooms...</p>
      </div>
    );
  }

  if (!loading && rooms.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Rooms</h1>
          <Link to="/rooms/add" className="btn btn-primary flex items-center">
            <FaPlus className="mr-2" /> Add Room
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">
            No rooms found. Add your first room to get started.
          </p>
          <Link
            to="/rooms/add"
            className="btn btn-primary inline-flex items-center"
          >
            <FaPlus className="mr-2" /> Add Your First Room
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Rooms</h1>
        <Link to="/rooms/add" className="btn btn-primary flex items-center">
          <FaPlus className="mr-2" /> Add Room
        </Link>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search rooms..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        <div className="flex space-x-2">
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>

          <select
            className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Rooms</option>
            <option value="vacant">Vacant</option>
            <option value="partial">Partially Occupied</option>
            <option value="full">Full</option>
          </select>
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="room-cards-container">
        {filteredRooms.map((room) => (
          <RoomCard
            key={room._id}
            room={room}
            onDelete={handleDelete}
            onViewRoom={handleViewRoom}
            onVacantRoomClick={handleVacantRoomClick}
          />
        ))}
      </div>

      {/* Show message when no rooms match filters */}
      {filteredRooms.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center mt-6">
          <p className="text-gray-600">
            No rooms match your search criteria. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default Rooms;
