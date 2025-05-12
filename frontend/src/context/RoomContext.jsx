import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// Create context
const RoomContext = createContext();

// Create a custom hook to use the room context
export const useRooms = () => useContext(RoomContext);

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  // Fetch all rooms
  const fetchRooms = async () => {
    setLoading(true);
    try {
      console.log("Fetching rooms...");
      const res = await axios.get("/rooms");
      if (res.data.success) {
        setRooms(res.data.data);
      } else {
        console.error("Error in API response:", res.data);
        toast.error(res.data.error || "Failed to fetch rooms");
        setRooms([]);
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
      toast.error(
        err.response?.data?.error ||
          "Failed to fetch rooms. Please check your connection."
      );
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a new room
  const addRoom = async (roomData) => {
    try {
      const res = await axios.post("/rooms", roomData);
      if (res.data.success) {
        setRooms([...rooms, res.data.data]);
        toast.success("Room created successfully");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error adding room:", err);
      toast.error(err.response?.data?.error || "Failed to create room");
      return false;
    }
  };

  // Update a room
  const updateRoom = async (id, roomData) => {
    try {
      const res = await axios.put(`/rooms/${id}`, roomData);
      if (res.data.success) {
        setRooms(
          rooms.map((room) =>
            room._id === id ? { ...room, ...res.data.data } : room
          )
        );
        toast.success("Room updated successfully");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating room:", err);
      toast.error(err.response?.data?.error || "Failed to update room");
      return false;
    }
  };

  // Delete a room
  const deleteRoom = async (id) => {
    try {
      const res = await axios.delete(`/rooms/${id}`);
      if (res.data.success) {
        setRooms(rooms.filter((room) => room._id !== id));
        toast.success("Room deleted successfully");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error deleting room:", err);
      toast.error(err.response?.data?.error || "Failed to delete room");
      return false;
    }
  };

  // Get a single room
  const getRoom = (id) => {
    if (loading) return null; // Return null if still loading
    return rooms.find((room) => room._id === id);
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        loading,
        initialized,
        fetchRooms,
        addRoom,
        updateRoom,
        deleteRoom,
        getRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
