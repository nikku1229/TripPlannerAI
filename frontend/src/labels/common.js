import app from "./app.json";
import home from "./pages/home.json";
import chatAssistant from "./pages/chatAssistant.json";
import createTrip from "./pages/createTrip.json";
import dashboard from "./pages/Dashboard.json";

const labels = {
  ...app,
  ...home,
  ...chatAssistant,
  ...createTrip,
  ...dashboard,
};

export default labels;
