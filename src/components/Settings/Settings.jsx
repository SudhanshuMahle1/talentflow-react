import React, { useState } from "react";
import "./Settings.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("Profile");

  const handleSave = () => {
    alert("Changes saved successfully!");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return (
          <div className="tab-content">
            <h2 className="tab-title">Profile Information</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" defaultValue="Admin User" />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" defaultValue="admin@talentflow.com" />
            </div>
            <div className="form-group">
              <label>Profile Picture</label>
              <input type="file" />
            </div>
            <div className="save-btn-container">
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        );

      case "Company":
        return (
          <div className="tab-content">
            <h2 className="tab-title">Company Information</h2>
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" defaultValue="TalentFlow Pvt Ltd" />
            </div>
            <div className="form-group">
              <label>Company Email</label>
              <input type="email" defaultValue="contact@talentflow.com" />
            </div>
            <div className="save-btn-container">
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        );

      case "Notifications":
        return (
          <div className="tab-content">
            <h2 className="tab-title">Notification Preferences</h2>
            <div className="form-group checkbox">
              <input type="checkbox" defaultChecked />
              <label>Email Notifications</label>
            </div>
            <div className="form-group checkbox">
              <input type="checkbox" />
              <label>Push Notifications</label>
            </div>
            <div className="save-btn-container">
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        );

      case "Privacy":
        return (
          <div className="tab-content">
            <h2 className="tab-title">Privacy Settings</h2>
            <div className="form-group checkbox">
              <input type="checkbox" defaultChecked />
              <label>Show my profile publicly</label>
            </div>
            <div className="form-group checkbox">
              <input type="checkbox" />
              <label>Allow data sharing</label>
            </div>
            <div className="save-btn-container">
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <h1 className="main-title">Settings</h1>
      <p className="sub-title">Manage your account and application preferences.</p>

      {/* Tabs */}
      <div className="tabs">
        {["Profile", "Company", "Notifications", "Privacy"].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="tab-body">{renderContent()}</div>
    </div>
  );
};

export default Settings;
