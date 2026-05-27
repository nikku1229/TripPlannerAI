import { tripAPI, weatherAPI } from "../services/servicesApi";
import { getCoordinates } from "../hooks/mapHook";
import toast from "react-hot-toast";

const fetchWeather = async (city, setWeather) => {
  try {
    const response = await weatherAPI.getWeather(city);
    setWeather(response.data);
  } catch (error) {
    console.error("Weather fetch error:", error);
  }
};

export const fetchTripDetails = async (
  id,
  setTrip,
  setWeather,
  setMapCoordinates,
  navigate,
  setLoading,
) => {
  try {
    const response = await tripAPI.getById(id);
    setTrip(response.data);
    fetchWeather(response.data.destination, setWeather);
    const coords = await getCoordinates(response.data.destination);
    setMapCoordinates(coords);
  } catch (error) {
    toast.error("Failed to load trip details");
    navigate("/dashboard");
  } finally {
    setLoading(false);
  }
};

export const getNormalizedBudget = (trip) => {
  const estimatedBudget = trip?.itinerary?.estimatedBudget;
  const actualBudget = trip.estimatedCost || trip.budget;

  if (!estimatedBudget || !actualBudget) return null;

  const estimatedTotal =
    estimatedBudget.total ||
    estimatedBudget.accommodation +
      estimatedBudget.food +
      estimatedBudget.activities +
      estimatedBudget.transport;

  if (estimatedTotal === 0) return null;

  const ratio = actualBudget / estimatedTotal;

  let accommodation = Math.round(estimatedBudget.accommodation * ratio);
  let food = Math.round(estimatedBudget.food * ratio);
  let activities = Math.round(estimatedBudget.activities * ratio);
  let transport = Math.round(estimatedBudget.transport * ratio);

  const sum = accommodation + food + activities + transport;
  const diff = actualBudget - sum;
  accommodation += diff;

  return {
    accommodation,
    food,
    activities,
    transport,
    total: actualBudget,
  };
};

export const handleDelete = async (id, navigate) => {
  if (window.confirm("Are you sure you want to delete this trip?")) {
    try {
      await tripAPI.delete(id);
      toast.success("Trip deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to delete trip");
    }
  }
};

export const handleExport = (trip) => {
  const tripData = JSON.stringify(trip, null, 2);
  const blob = new Blob([tripData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `trip-${trip.destination}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Trip exported successfully");
};
