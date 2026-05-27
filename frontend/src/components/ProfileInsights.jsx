import React from "react";
import { formatINR } from "../hooks/currency";
import { motion } from "framer-motion";
import Icons from "../utils/icons/index";
import { navigateToTrip } from "../utils/usage";
import labels from "../labels/common";

function ProfileInsights({ stats, trips }) {
  const travelStats = [
    {
      label: "Total Trips",
      value: stats.totalTrips,
      icon: Icons.FiMapPin,
      color: "#0d530e",
    },
    {
      label: "Total Budget",
      value: formatINR(stats.totalBudget),
      icon: Icons.PiCurrencyInr,
      color: "#0d530e",
    },
    {
      label: "Days Traveled",
      value: stats.totalDays,
      icon: Icons.FiClock,
      color: "#0d530e",
    },
    {
      label: "Destinations",
      value: stats.uniqueDestinations,
      icon: Icons.FiGlobe,
      color: "#0d530e",
    },
  ];

  const achievementStats = [
    {
      label: "Favorite Destination",
      value: stats.favoriteDestination,
      icon: Icons.FiStar,
      color: "#0d530e",
    },
    {
      label: "Avg Budget/Day",
      value: `₹${formatINR(stats.averageBudgetPerDay)}`,
      icon: Icons.FiTrendingUp,
      color: "#0d530e",
    },
    {
      label: "Adventure Score",
      value: "Explorer",
      icon: Icons.FiAward,
      color: "#0d530e",
    },
  ];

  const recentTrips = trips.slice(0, 3);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="stats-cards-section"
      >
        <h2 className="section-title">{labels.travelStatisticsTitle}</h2>
        <div className="stats-cards-grid">
          {travelStats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div
                className="stat-icon"
                style={{
                  backgroundColor: `${stat.color}15`,
                  color: stat.color,
                }}
              >
                <stat.icon size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="achievements-section"
      >
        <h2 className="section-title">{labels.achievementInsightsTitle}</h2>
        <div className="achievements-grid">
          {achievementStats.map((stat, idx) => (
            <div key={idx} className="achievement-card">
              <stat.icon size={28} color={stat.color} />
              <div>
                <p className="achievement-label">{stat.label}</p>
                <p className="achievement-value">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Trips Section */}
      {recentTrips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="recent-trips-section"
        >
          <h2 className="section-title">{labels.profileRecentTravelTitle}</h2>
          <div className="recent-trips-grid">
            {recentTrips.map((trip) => (
              <div
                key={trip._id}
                className="recent-trip-card"
                onClick={() => navigateToTrip(trip._id)}
              >
                <div className="trip-card-header">
                  <div className="trip-destination-icon">
                    {trip.destination?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3>{trip.destination}</h3>
                    <p>
                      {trip.days} days • {"₹"}
                      {formatINR(trip.estimatedCost || trip.budget)}
                    </p>
                  </div>
                </div>
                {trip.interests && (
                  <div className="trip-interests">
                    {trip.interests.slice(0, 3).map((interest, idx) => (
                      <span key={idx} className="interest-chip">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}

export default ProfileInsights;
