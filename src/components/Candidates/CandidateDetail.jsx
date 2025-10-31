import React from "react";
import "./Candidates.css";

const CandidateDetail = ({ candidate, onClose }) => {
  return (
    <div className="candidate-modal-overlay">
      <div className="candidate-modal modal-large">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
        <h3>{candidate.name}</h3>
        <p><strong>Email:</strong> {candidate.email}</p>
        <p><strong>Phone:</strong> {candidate.phone}</p>
        <p><strong>Location:</strong> {candidate.location}</p>
        <p><strong>Experience:</strong> {candidate.experience}</p>
        <p><strong>Stage:</strong> {candidate.stage}</p>
        <p><strong>Skills:</strong> {candidate.skills.join(", ")}</p>

        {/*  Timeline */}
        <div className="timeline">
          <h4>Status Timeline</h4>
          <ul>
            {candidate.statusHistory?.map((s, i) => (
              <li key={i}>
                <span className="stage">{s.stage}</span> –{" "}
                <span className="date">{s.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
