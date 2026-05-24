const express = require("express");
const weatherController = require("../controllers/weather.controller");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

router.get("/", weatherController.getWeather);
router.get("/forecast", weatherController.getForecast);

module.exports = router;
