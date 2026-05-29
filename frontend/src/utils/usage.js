import toast from "react-hot-toast";
import labels from "../labels/common";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const copyMessage = (content) => {
  navigator.clipboard.writeText(content);
  toast.success("Copied to clipboard!");
};

export const clearChat = (setMessages) => {
  setMessages([
    {
      id: Date.now(),
      type: "bot",
      content: labels.clearMessageContent,
      timestamp: new Date(),
    },
  ]);
  toast.success("Chat cleared");
};

export const chartItems = {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
};

export const COLORS = [
  "#4caf50",
  "#66bb6a",
  "#81c784",
  "#a5d6a7",
  "#c8e6c9",
  "#2e7d32",
  "#388e3c",
  "#43a047",
];

export const navigateToTrip = (tripId) => {
  window.location.href = `/trip/${tripId}`;
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
