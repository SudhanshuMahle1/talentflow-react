import React from "react";

const ApplicationDetail = ({ app, onClose }) => {
  if (!app) return null;

  return (
    <div className="application-modal-overlay" onClick={onClose}>
      <div
        className="application-modal"
        onClick={(e) => e.stopPropagation()} // prevent overlay close when clicking inside
      >
        <div className="application-modal-header">
          <h3>{app.name}</h3>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        <p>
          <strong>Position:</strong> {app.position}
        </p>
        <p>
          <strong>Company:</strong> {app.company}
        </p>
        <p>
          <strong>Email:</strong> {app.email}
        </p>
        <p>
          <strong>Phone:</strong> {app.phone}
        </p>

        <div className="application-tags">
          {app.skills.map((skill, i) => (
            <span key={i} className="application-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
