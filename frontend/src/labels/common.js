import app from "./app.json";
import home from "./pages/home.json";
import chatAssistant from "./pages/chatAssistant.json";
import createTrip from "./pages/createTrip.json";
import dashboard from "./pages/Dashboard.json";
import loginRegister from "./pages/LoginRegister.json";
import profile from "./pages/profile.json";
import tripDetails from "./pages/tripDetails.json";

const labels = {
  ...app,
  ...home,
  ...chatAssistant,
  ...createTrip,
  ...dashboard,
  ...loginRegister,
  ...profile,
  ...tripDetails,
};

export default labels;
