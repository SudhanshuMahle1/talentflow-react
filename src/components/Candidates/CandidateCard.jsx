import React from "react";
import "./Candidates.css";

const CandidateCard = ({ candidate }) => {
  return (
    <div className="candidate-card">
      <div className="candidate-header">
        <div className="candidate-avatar">{candidate.name[0]}</div>
        <div>
          <h3>{candidate.name}</h3>
          <p>{candidate.experience} experience</p>
        </div>
      </div>
      <div className="candidate-info">
        <p>📧 {candidate.email}</p>
        <p>📞 {candidate.phone}</p>
        <p>📍 {candidate.location}</p>
      </div>
      <div className="candidate-skills">
        {candidate.skills.map((skill, i) => (
          <span key={i} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CandidateCard;
