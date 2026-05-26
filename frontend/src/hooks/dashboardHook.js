import { tripAPI } from "../services/servicesApi";
import toast from "react-hot-toast";

export const fetchTrips = async (setTrips, setLoading) => {
  try {
    const response = await tripAPI.getAll();
    setTrips(response.data);
  } catch (error) {
    console.error("Error fetching trips:", error);
  } finally {
    setLoading(false);
  }
};

export const handleDeleteTrip = async (tripId, setTrips, setLoading) => {
  if (window.confirm("Are you sure you want to delete this trip?")) {
    try {
      await tripAPI.delete(tripId);
      toast.success("Trip deleted successfully");
      fetchTrips(setTrips, setLoading);
    } catch (error) {
      toast.error("Failed to delete trip");
    }
  }
};
