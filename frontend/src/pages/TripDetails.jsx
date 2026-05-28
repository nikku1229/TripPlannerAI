import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import {
  fetchTripDetails,
  getNormalizedBudget,
  handleDelete,
  handleExport,
} from "../hooks/tripDetailsHook";
import Icons from "../utils/icons/index";
import { formatINR } from "../hooks/currency";
import { useTheme } from "../context/ThemeContext";
import labels from "../labels/common";

const TripDetails = () => {
  const { id } = useParams();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState([20.5937, 78.9629]);

  useEffect(() => {
    fetchTripDetails(
      id,
      setTrip,
      setWeather,
      setMapCoordinates,
      navigate,
      setLoading,
    );
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{labels.loadingBlockText}</p>
      </div>
    );
  }

  if (!trip) return null;

  const itinerary = trip.itinerary;
  const dailyItinerary = itinerary?.dailyItinerary || [];

  const normalizedBudget = getNormalizedBudget(trip);

  return (
    <div className="trip-details-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="trip-header"
      >
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          <Icons.FiArrowLeft size={18} /> {labels.backBtnText}
        </button>

        <div className="trip-header-main">
          <div className="trip-info-section">
            <h1 className="trip-title">{trip.destination}</h1>
            <div className="trip-meta">
              <span className="meta-badge">
                <Icons.FiCalendar size={14} /> {trip.days} days
              </span>
              <span className="meta-badge">
                <Icons.PiCurrencyInr size={14} />{" "}
                {formatINR(trip.estimatedCost || trip.budget)}
              </span>
              <span className="meta-badge">
                <Icons.FiMapPin size={14} /> {trip.travelStyle} travel
              </span>
            </div>
          </div>

          <div className="trip-actions">
            <button
              onClick={() => {
                handleExport(trip);
              }}
              className="action-btn trip-export-btn"
            >
              <Icons.FiDownload size={16} /> {labels.exportBtnText}
            </button>
            <button
              onClick={() => {
                handleDelete(id, navigate);
              }}
              className="action-btn trip-delete-btn"
            >
              <Icons.FiTrash2 size={16} /> {labels.deleteTripBtnText}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Weather Section */}
      {weather && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="weather-card"
        >
          <h2 className="section-title">
            <Icons.FiSun className="section-icon" /> Weather in {weather.city}
          </h2>
          <div className="weather-grid">
            <div className="weather-item">
              <div className="weather-value">
                {Math.round(weather.temperature)}°C
              </div>
              <div className="weather-label">
                {labels.tripDetailTemperatureLabel}
              </div>
            </div>
            <div className="weather-item">
              <div className="weather-value">{weather.humidity}%</div>
              <div className="weather-label">
                {labels.tripDetailHumidityLabel}
              </div>
            </div>
            <div className="weather-item">
              <div className="weather-value">{weather.windSpeed} km/h</div>
              <div className="weather-label">
                {labels.tripDetailWindSpeedLabel}
              </div>
            </div>
            <div className="weather-item">
              <div className="weather-value capitalize">
                {weather.condition}
              </div>
              <div className="weather-label">
                {labels.tripDetailConditionLabel}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Itinerary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="itinerary-card"
      >
        <h2 className="section-title">{labels.travelItinerytitle}</h2>
        <div className="itinerary-list">
          {dailyItinerary.map((day, idx) => (
            <div key={idx} className="itinerary-day">
              <div className="day-header">
                <span className="day-number">Day {day.day || idx + 1}</span>
              </div>
              <div className="day-content">
                {day.activities && day.activities.length > 0 && (
                  <div className="day-section">
                    <h4>
                      <Icons.FiClock size={14} /> Activities
                    </h4>
                    <ul>
                      {day.activities.map((activity, i) => (
                        <li key={i}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {day.meals && day.meals.length > 0 && (
                  <div className="day-section">
                    <h4>
                      <Icons.FiCoffee size={14} /> Meals
                    </h4>
                    <ul>
                      {day.meals.map((meal, i) => (
                        <li key={i}>{meal}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {day.accommodation && (
                  <div className="day-section">
                    <h4>
                      <Icons.FiHome size={14} /> Accommodation
                    </h4>
                    <p>{day.accommodation}</p>
                  </div>
                )}
                {day.transport && (
                  <div className="day-section">
                    <h4>
                      <Icons.FiMap size={14} /> Transport
                    </h4>
                    <p>{day.transport}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations Section */}
      <div className="recommendations-grid">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="recommendation-card"
        >
          <h3>
            <Icons.FiCamera size={18} /> {labels.recommendedPlaceTitle}
          </h3>
          <ul>
            {itinerary?.recommendedPlaces?.map((place, idx) => (
              <li key={idx}>
                <span className="bullet">•</span>
                <span>{place}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="recommendation-card"
        >
          <h3>
            <Icons.FiCoffee size={18} /> {labels.foodSuggestionsTitle}
          </h3>
          <ul>
            {itinerary?.foodSuggestions?.map((food, idx) => (
              <li key={idx}>
                <span className="bullet">•</span>
                <span>{food}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Travel Tips & Budget */}
      <div className="tips-budget-grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="tips-card"
        >
          <h3>{labels.travelTripsTitle}</h3>
          <ul>
            {itinerary?.travelTips?.map((tip, idx) => (
              <li key={idx}>
                <span className="bullet">✨</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="budget-card"
        >
          <h3>{labels.budgetBreakdownTitle}</h3>
          {normalizedBudget ? (
            <div className="budget-list">
              <div className="budget-item">
                <span>Accommodation</span>
                <span className="budget-amount">
                  ₹{formatINR(normalizedBudget.accommodation)}
                </span>
              </div>
              <div className="budget-item">
                <span>Food</span>
                <span className="budget-amount">
                  ₹{formatINR(normalizedBudget.food)}
                </span>
              </div>
              <div className="budget-item">
                <span>Activities</span>
                <span className="budget-amount">
                  ₹{formatINR(normalizedBudget.activities)}
                </span>
              </div>
              <div className="budget-item">
                <span>Transport</span>
                <span className="budget-amount">
                  ₹{formatINR(normalizedBudget.transport)}
                </span>
              </div>
              <div className="budget-total">
                <span>Total</span>
                <span>₹{formatINR(normalizedBudget.total)}</span>
              </div>
            </div>
          ) : (
            <p className="no-data">{labels.budgetBreakdownError}</p>
          )}
        </motion.div>
      </div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="map-card"
      >
        <button onClick={() => setShowMap(!showMap)} className="map-toggle-btn">
          {showMap ? "Hide Map" : "Show Map"}
        </button>

        {showMap && (
          <div className="map-container">
            <MapContainer
              key={mapCoordinates[0]}
              center={mapCoordinates}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url={
                  isDarkMode
                    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                }
              />
              <Marker position={mapCoordinates}>
                <Popup>
                  <div className="map-popup">
                    <strong>{trip?.destination}</strong>
                    <br />
                    <span>Your dream destination!</span>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TripDetails;
