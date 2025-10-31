import React from "react";
import { useNavigate } from "react-router-dom";
import "./Jobs.css";

export default function JobCard({ job, onArchive, onDelete }) {
  const navigate = useNavigate();
  return (
    <div className={`job-card ${job.archived ? "archived" : ""}`}>
      <div className="job-card-top">
        <div>
          <h3 className="job-title">{job.title}</h3>
          <div className="company">{job.company}</div>
        </div>

        <div className="job-actions">
          <button onClick={() => navigate(`/jobs/${job.id}`)} className="view">
            View
          </button>
          <button onClick={onArchive} className="archive">
            {job.archived ? "Unarchive" : "Archive"}
          </button>
          <button onClick={onDelete} className="delete">
            Delete
          </button>
        </div>
      </div>

      <div className="job-info">
        <div>{job.location}</div>
        <div>
          {job.salaryMin || "-"} — {job.salaryMax || "-"}
        </div>
        <div>Posted {job.posted}</div>
      </div>
      <div className="job-desc">{job.description ? job.description.slice(0, 120) + "…" : ""}</div>
    </div>
  );
}
