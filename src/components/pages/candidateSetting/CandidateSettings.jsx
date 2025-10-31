import React, { useState, useEffect } from "react";
import "./CandidateSettings.css";

const CandidateSettings = () => {
  const [profile, setProfile] = useState({
    name: "Sudhanshu Mahle",
    email: "sudhanshumahle748@gmail.com",
    phone: "+91 6265282197",
    location: "Bhopal, India",
  });

  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    assessmentReminders: false,
    emailUpdates: true,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  useEffect(() => {
    // load from localStorage later
  }, []);

  return (
    <div className="settings-container">
      <h2>Candidate Settings</h2>

      <div className="settings-section">
        <h3>Profile Information</h3>
        <div className="settings-form">
          <label>
            Full Name:
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Email Address:
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Phone Number:
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleProfileChange}
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleProfileChange}
            />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Notifications</h3>
        <div className="settings-toggles">
          <label>
            <input
              type="checkbox"
              checked={notifications.jobAlerts}
              onChange={() => handleToggle("jobAlerts")}
            />
            Job Alerts
          </label>
          <label>
            <input
              type="checkbox"
              checked={notifications.assessmentReminders}
              onChange={() => handleToggle("assessmentReminders")}
            />
            Assessment Reminders
          </label>
          <label>
            <input
              type="checkbox"
              checked={notifications.emailUpdates}
              onChange={() => handleToggle("emailUpdates")}
            />
            Email Updates
          </label>
        </div>
      </div>

      <button className="save-settings-btn">Save Settings</button>
    </div>
  );
};

export default CandidateSettings;
