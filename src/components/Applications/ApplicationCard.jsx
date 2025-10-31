import React from "react";
import { Eye } from "lucide-react";

const ApplicationCard = ({ app, onView }) => {
  return (
    <div className="application-card">
      <div className="application-card-header">
        <h3 className="application-name">{app.name}</h3>
        <button className="view-profile-btn" onClick={() => onView(app)}>
          <Eye size={16} /> View Profile
        </button>
      </div>

      <p className="application-position">
        Applied for <strong>{app.position}</strong> at {app.company}
      </p>

      <div className="application-contact">
        <p>📧 {app.email}</p>
        <p>📞 {app.phone}</p>
      </div>

      <div className="application-tags">
        {app.skills.map((skill, index) => (
          <span key={index} className="application-tag">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ApplicationCard;
