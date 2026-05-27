import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Icons from "../utils/icons/index";
import labels from "../labels/common";
import { formatINR } from "../hooks/currency";
import { handleSubmit } from "../hooks/createTripHook";

const CreateTrip = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    days: 3,
    budget: 20000,
    travelStyle: "moderate",
    interests: [],
  });

  const handleInterestToggle = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <div className="create-trip-container">
      <div className="create-trip-card">
        <h1 className="gradient-text">{labels.createTripTitleHead}</h1>
        <p className="subtitle">{labels.createTripTextHead}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(formData, setLoading, navigate);
          }}
        >
          <div className="form-group">
            <label>
              <Icons.FiMapPin /> {labels.formFieldCreateTrip.destinationLabel}
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
              placeholder={
                labels.formFieldCreateTrip.destinationInputPlaceholder
              }
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <Icons.FiCalendar /> {labels.formFieldCreateTrip.daysLabel}
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.days}
                onChange={(e) =>
                  setFormData({ ...formData, days: parseInt(e.target.value) })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>
                <Icons.PiCurrencyInr /> {labels.formFieldCreateTrip.budgetLabel}
              </label>
              <input
                type="number"
                min="10000"
                max="5000000"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: parseInt(e.target.value) })
                }
                required
              />
              <small>
                Current: ₹{formatINR(formData.budget)} for {formData.days} days
              </small>
            </div>
          </div>

          <div className="budget-range">
            <div className="budget-range-label">
              <span>{labels.formFieldCreateTrip.budgetRangeLabel}</span>
            </div>
            <div className="budget-bar">
              <div
                className="budget-bar-fill"
                style={{
                  width: `${Math.min(100, (formData.budget / 500000) * 100)}%`,
                }}
              ></div>
            </div>
            <div className="budget-range-label" style={{ marginTop: "6px" }}>
              <span>
                {labels.formFieldCreateTrip.budgetRangeMinMax.budgetMinRange}
              </span>
              <span>
                {labels.formFieldCreateTrip.budgetRangeMinMax.budgetMaxRange}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>
              <Icons.FiCompass /> {labels.formFieldCreateTrip.travelStyleLabel}
            </label>
            <div className="styles-grid">
              {labels?.travelStyles &&
                labels?.travelStyles.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, travelStyle: style.value })
                    }
                    className={`style-btn ${formData.travelStyle === style.value ? "active" : ""}`}
                  >
                    <div className="style-icon">{style.icon}</div>
                    <div className="style-label">{style.label}</div>
                    <div className="style-budget">
                      From ₹{style.minBudget.toLocaleString()}
                    </div>
                  </button>
                ))}
            </div>
          </div>

          <div className="form-group">
            <label>
              <Icons.FiHeart /> {labels.formFieldCreateTrip.interestLabel}
            </label>
            <div className="interests-grid">
              {labels?.interestOptions &&
                labels?.interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`interest-btn ${formData.interests.includes(interest) ? "active" : ""}`}
                  >
                    {interest}
                  </button>
                ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (
              <>
                <Icons.FiLoader className="spinning" />{" "}
                {labels.buttonText.loading}
              </>
            ) : (
              labels.buttonText.static
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;
