import { tripAPI } from "../services/servicesApi";
import toast from "react-hot-toast";

export const handleSubmit = async (formData, setLoading, navigate) => {
  if (formData.interests.length === 0) {
    toast.error("Please select at least one interest");
    return;
  }

  setLoading(true);
  try {
    const response = await tripAPI.generate({ ...formData, currency: "INR" });
    toast.success("Trip generated successfully!");
    navigate(`/trip/${response.data.trip._id}`);
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to generate trip");
  } finally {
    setLoading(false);
  }
};
