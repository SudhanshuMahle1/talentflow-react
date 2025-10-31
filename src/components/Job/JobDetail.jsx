import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Jobs.css";

export default function JobDetail({ jobs = [], onArchive, onDelete }) {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = jobs.find((j) => String(j.id) === String(jobId));

  if (!job) return (
    <div className="job-detail-root">
      <p>Job not found.</p>
      <button onClick={() => navigate("/jobs")}>Back to jobs</button>
    </div>
  );

  return (
    <div className="job-detail-root">
      <div className="jobs-topbar">
        <div>
          <h2>{job.title}</h2>
          <p className="muted">{job.company} • {job.location}</p>
        </div>
        <div>
          <button className="primary-btn" onClick={() => onArchive(job.id)}>{job.archived ? "Unarchive" : "Archive"}</button>
          <button className="muted-btn" onClick={() => { onDelete(job.id); navigate("/jobs"); }}>Delete</button>
        </div>
      </div>

      <div className="job-detail-content">
        <h3>About the role</h3>
        <p>{job.description}</p>

        <h4>Details</h4>
        <ul>
          <li><strong>Location: </strong>{job.location}</li>
          <li><strong>Salary: </strong>{job.salaryMin} — {job.salaryMax}</li>
          <li><strong>Posted: </strong>{job.posted}</li>
          <li><strong>Tags: </strong>{(job.tags || []).join(", ")}</li>
        </ul>
      </div>
    </div>
  );
}
