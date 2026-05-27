import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Enhanced geocoding function
export const getCoordinates = async (destination) => {
  const commonCoordinates = {
    paris: [48.8566, 2.3522],
    london: [51.5074, -0.1278],
    "new york": [40.7128, -74.006],
    tokyo: [35.6762, 139.6503],
    dubai: [25.2048, 55.2708],
    singapore: [1.3521, 103.8198],
    bangkok: [13.7367, 100.5231],
    mumbai: [19.076, 72.8777],
    delhi: [28.6139, 77.209],
    goa: [15.2993, 74.124],
    jaipur: [26.9124, 75.7873],
    manali: [32.2432, 77.1892],
    kerala: [10.1632, 76.6413],
    chennai: [13.0827, 80.2707],
    bangalore: [12.9716, 77.5946],
    hyderabad: [17.385, 78.4867],
    kolkata: [22.5726, 88.3639],
    udaipur: [24.5854, 73.7125],
    shimla: [31.1048, 77.1734],
    rishikesh: [30.0869, 78.2676],
  };

  const key = destination?.toLowerCase();
  if (commonCoordinates[key]) {
    return commonCoordinates[key];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "TripAI-App/1.0",
        },
      },
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
  return [20.5937, 78.9629];
};
