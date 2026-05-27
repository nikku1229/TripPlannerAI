import { tripAPI, profileAPI } from "../services/servicesApi";
import toast from "react-hot-toast";

const calculateStats = (tripsData, setStats) => {
  const totalTrips = tripsData.length;
  const totalBudget = tripsData.reduce(
    (sum, trip) => sum + (trip.estimatedCost || trip.budget || 0),
    0,
  );
  const totalDays = tripsData.reduce((sum, trip) => sum + trip.days, 0);
  const uniqueDestinations = new Set(tripsData.map((trip) => trip.destination))
    .size;

  const destinationCount = tripsData.reduce((acc, trip) => {
    acc[trip.destination] = (acc[trip.destination] || 0) + 1;
    return acc;
  }, {});

  const favoriteDestination = Object.keys(destinationCount).reduce(
    (a, b) => (destinationCount[a] > destinationCount[b] ? a : b),
    "",
  );

  const averageBudgetPerDay = totalDays > 0 ? totalBudget / totalDays : 0;

  setStats({
    totalTrips,
    totalBudget,
    totalDays,
    uniqueDestinations,
    favoriteDestination: favoriteDestination || "N/A",
    averageBudgetPerDay,
  });
};

export const fetchUserTrips = async (setTrips, setStats) => {
  try {
    const response = await tripAPI.getAll();
    setTrips(response.data);
    calculateStats(response.data, setStats);
  } catch (error) {
    console.error("Error fetching trips:", error);
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
    }
  }
};

export const handleUpdate = async (
  setLoading,
  formData,
  updateUser,
  setIsEditing,
) => {
  setLoading(true);
  try {
    const response = await profileAPI.profileUpdate({
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
      phone: formData.phone,
      location: formData.location,
    });

    const updatedUser = response.data;
    updateUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    toast.success("Profile updated successfully");
    setIsEditing(false);
  } catch (error) {
    console.error("Update error:", error);
    toast.error(error.response?.data?.message || "Failed to update profile");
  } finally {
    setLoading(false);
  }
};

export const loadUserPreferences = async (setPreferences) => {
  try {
    const response = await profileAPI.getPreferences();
    if (response.data) {
      setPreferences((prev) => ({
        ...prev,
        ...response.data,
      }));
    }
  } catch (error) {
    console.error("Error loading preferences:", error);
    if (error.response?.status === 401) {
      toast.error("Please login to save preferences");
    }
  }
};

export const handleSavePreferences = async (
  preferences,
  setLoading,
  setPreferences,
  setIsEditingPreferences,
) => {
  setLoading(true);
  try {
    const response = await profileAPI.updatePreferences(preferences);

    const updatedPrefs = response.data;
    setPreferences(updatedPrefs);
    toast.success("Preferences saved successfully");
    setIsEditingPreferences(false);
  } catch (error) {
    console.error("Save preferences error:", error);
    toast.error(error.response?.data?.message || "Failed to save preferences");
  } finally {
    setLoading(false);
  }
};
