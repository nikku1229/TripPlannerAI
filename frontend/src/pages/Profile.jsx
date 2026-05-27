import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProfileInsights from "../components/ProfileInsights";
import Icons from "../utils/icons/index";
import { formatINR } from "../hooks/currency";
import { useAuth } from "../context/AuthContext";
import {
  fetchUserTrips,
  handleUpdate,
  loadUserPreferences,
  handleSavePreferences,
} from "../hooks/profileHook";
import labels from "../labels/common";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalBudget: 0,
    totalDays: 0,
    uniqueDestinations: 0,
    favoriteDestination: "",
    averageBudgetPerDay: 0,
  });

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });

  const [preferences, setPreferences] = useState({
    travelStyle: user?.preferences?.travelStyle || "moderate",
    favoriteDestinations: user?.preferences?.favoriteDestinations || "",
    emailNotifications: user?.preferences?.emailNotifications !== false,
    currency: user?.preferences?.currency || "INR",
    language: user?.preferences?.language || "en",
    budgetRange: user?.preferences?.budgetRange || "moderate",
  });

  useEffect(() => {
    fetchUserTrips(setTrips, setStats);
    loadUserPreferences(setPreferences);
  }, []);

  return (
    <div className="profile-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="profile-header-card"
      >
        <div className="profile-cover"></div>
        <div className="profile-content">
          <div className="avatar-wrapper">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button
              className="edit-avatar-btn"
              onClick={() => setIsEditing(true)}
              title="Edit Profile"
            >
              <Icons.FiEdit2 size={14} />
            </button>
          </div>

          <div className="profile-details">
            {isEditing ? (
              <div className="edit-form-container">
                <div className="edit-form-grid">
                  <div className="edit-field">
                    <label>
                      {labels.formFieldProfileDetails.fullNameLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="edit-field-input"
                    />
                  </div>
                  <div className="edit-field">
                    <label>{labels.formFieldProfileDetails.emailLabel}</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="edit-field-input"
                    />
                  </div>
                  <div className="edit-field">
                    <label>{labels.formFieldProfileDetails.phoneLabel}</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="edit-field-input"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div className="edit-field">
                    <label>
                      {labels.formFieldProfileDetails.locationLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="edit-field-input"
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="edit-field">
                    <label>{labels.formFieldProfileDetails.bioLabel}</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      className="edit-field-input edit-textarea"
                      rows="3"
                      placeholder={
                        labels.formFieldProfileDetails.bioPlaceholder
                      }
                    />
                  </div>
                </div>
                <div className="edit-actions">
                  <button
                    onClick={() => {
                      handleUpdate(
                        setLoading,
                        formData,
                        updateUser,
                        setIsEditing,
                      );
                    }}
                    disabled={loading}
                    className="save-profile-btn"
                  >
                    <Icons.FiSave size={16} />{" "}
                    {loading
                      ? labels.formFieldProfileDetails.loading.loading
                      : labels.formFieldProfileDetails.loading.static}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="cancel-profile-btn"
                  >
                    <Icons.FiX size={16} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="profile-name">{user?.name}</h1>
                <p className="profile-bio">
                  {user?.bio || labels.dummyBioText}
                </p>
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <Icons.FiMail size={14} />
                    <span>{user?.email}</span>
                  </div>
                  <div className="profile-info-item">
                    <Icons.FiCalendar size={14} />
                    <span>
                      Member since{" "}
                      {new Date(
                        user?.createdAt || Date.now(),
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  {user?.phone && (
                    <div className="profile-info-item">
                      <Icons.FiUser size={14} />
                      <span>{user.phone}</span>
                    </div>
                  )}

                  {user?.location && (
                    <div className="profile-info-item">
                      <Icons.FiMapPin size={14} />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <ProfileInsights stats={stats} trips={trips} />

      {/* Preferences Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="preferences-section"
      >
        <div className="preferences-header">
          <h2 className="section-title">
            {labels.profileTravelPreferenceTitle}
          </h2>
          {!isEditingPreferences && (
            <button
              onClick={() => setIsEditingPreferences(true)}
              className="edit-preferences-btn"
            >
              <Icons.FiEdit2 size={14} /> Edit
            </button>
          )}
        </div>

        {isEditingPreferences ? (
          <div className="preferences-edit-form">
            <div className="preferences-grid">
              <div className="preference-item">
                <label>{labels.preferenceForm.travelStyleLabel}</label>
                <select
                  value={preferences.travelStyle}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      travelStyle: e.target.value,
                    })
                  }
                  className="preference-select"
                >
                  {labels?.preferenceForm?.travelStylesOptions?.map(
                    (option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.text}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="preference-item">
                <label>{labels.preferenceForm.favoriteDestinationLabel}</label>
                <input
                  type="text"
                  value={preferences.favoriteDestinations}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      favoriteDestinations: e.target.value,
                    })
                  }
                  placeholder={
                    labels.preferenceForm.favoriteDestinationPlaceholder
                  }
                  className="preference-input"
                />
              </div>

              <div className="preference-item">
                <label>{labels.preferenceForm.emailNotificationLabel}</label>
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="notifications"
                    checked={preferences.emailNotifications}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        emailNotifications: e.target.checked,
                      })
                    }
                  />
                  <label htmlFor="notifications">
                    {labels.preferenceForm.emailNotificationCheckboxLabel}
                  </label>
                </div>
              </div>

              <div className="preference-item">
                <label>{labels.preferenceForm.currencyLabel}</label>
                <select
                  value={preferences.currency}
                  onChange={(e) =>
                    setPreferences({ ...preferences, currency: e.target.value })
                  }
                  className="preference-select"
                >
                  {labels?.preferenceForm?.currencyTypeOptions?.map(
                    (option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.text}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="preference-item">
                <label>{labels.preferenceForm.languageLabel}</label>
                <select
                  value={preferences.language}
                  onChange={(e) =>
                    setPreferences({ ...preferences, language: e.target.value })
                  }
                  className="preference-select"
                >
                  {labels?.preferenceForm?.languageTypeOptions.map(
                    (option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.text}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="preference-item">
                <label>{labels.preferenceForm.budgetRangeLabel}</label>
                <select
                  value={preferences.budgetRange}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      budgetRange: e.target.value,
                    })
                  }
                  className="preference-select"
                >
                  {labels?.preferenceForm?.budgetRangeOptions.map(
                    (option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.text}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            <div className="preferences-actions">
              <button
                onClick={() => {
                  handleSavePreferences(
                    preferences,
                    setLoading,
                    setPreferences,
                    setIsEditingPreferences,
                  );
                }}
                disabled={loading}
                className="save-preferences-btn"
              >
                <Icons.FiSave size={16} />{" "}
                {loading
                  ? labels.preferenceForm.loading.loading
                  : labels.preferenceForm.loading.static}
              </button>
              <button
                onClick={() => setIsEditingPreferences(false)}
                className="cancel-preferences-btn"
              >
                <Icons.FiX size={16} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="preferences-display">
            <div className="preferences-grid-display">
              <div className="pref-display-item">
                <span className="pref-label">
                  {labels.preferenceForm.travelStyleLabel}
                </span>
                <span className="pref-value capitalize">
                  {preferences.travelStyle}
                </span>
              </div>
              <div className="pref-display-item">
                <span className="pref-label">
                  {labels.preferenceForm.favoriteDestinationLabel}
                </span>
                <span className="pref-value">
                  {preferences.favoriteDestinations || "Not specified"}
                </span>
              </div>
              <div className="pref-display-item">
                <span className="pref-label">
                  {labels.preferenceForm.emailNotificationLabel}
                </span>
                <span className="pref-value">
                  {preferences.emailNotifications ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="pref-display-item">
                <span className="pref-label">
                  {labels.preferenceForm.currencyLabel}
                </span>
                <span className="pref-value">{preferences.currency}</span>
              </div>
              <div className="pref-display-item">
                <span className="pref-label">
                  {labels.preferenceForm.languageLabel}
                </span>
                <span className="pref-value">
                  {preferences.language === "en"
                    ? "English"
                    : preferences.language}
                </span>
              </div>
              <div className="pref-display-item">
                <span className="pref-label">
                  {labels.preferenceForm.budgetRangeLabel}
                </span>
                <span className="pref-value capitalize">
                  {preferences.budgetRange}
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
