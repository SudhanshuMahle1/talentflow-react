import React from "react";
import "./Header.css";

function Header({ role, onToggleRole }) {
  const isCandidate = role === "candidate";

  return (
    <header className="topbar">
      <div className="logo">
        Talent<span>Flow</span>
      </div>

      {/*  Role-Based Message Section */}
      <div className="greeting-bar">
        {isCandidate ? (
          <span className="greeting-message">
            ✨ Ready to explore new opportunities?
          </span>
        ) : (
          <span className="greeting-message">
            📊 Manage and track your hiring progress.
          </span>
        )}
      </div>

      <div className="right-section">
        {/* Role Toggle */}
        <div className="role-toggle">
          <span className={`role-label admin ${!isCandidate ? "active" : ""}`}>
            Admin
          </span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isCandidate}
              onChange={onToggleRole}
            />
            <span className="slider"></span>
          </label>
          <span
            className={`role-label candidate ${isCandidate ? "active" : ""}`}
          >
            Candidate
          </span>
        </div>

        {/* Notification + User Info */}
        <i className="fa-regular fa-bell notification"></i>
        <div className="separator"></div>
        <span className="user-name">
          {isCandidate ? "Candidate User" : "Admin User"}
        </span>

        {/* Profile Circle */}
        <div
          className="profile-circle"
          style={{
            backgroundColor: isCandidate ? "#34a853" : "#1a73e8",
          }}
        >
          {isCandidate ? "C" : "A"}
        </div>
      </div>
    </header>
  );
}

export default Header;
