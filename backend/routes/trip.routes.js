// routes/trip.routes.js
const express = require("express");
const tripController = require("../controllers/trip.controller");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

router.post("/generate", tripController.generateItinerary);
router.get("/", tripController.getUserTrips);
router.get("/:id", tripController.getTripById);
router.put("/:id", tripController.updateTrip);
router.delete("/:id", tripController.deleteTrip);

module.exports = router;
