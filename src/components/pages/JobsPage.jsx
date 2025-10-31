import React, { useState } from "react";
import JobList from "../Job/JobList";
import JobFormModal from "../Job/JobFormModal";
import "./../Job/Jobs.css";

function JobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="jobs-page-container">
      <div className="jobs-header">
        <h2>Jobs</h2>
        <p>Manage your job postings and track applications.</p>
        <button className="post-job-btn" onClick={() => setIsModalOpen(true)}>
          + Post New Job
        </button>
      </div>

      <div className="jobs-filters">
        <input type="text" placeholder="Search jobs..." className="search-input" />
        <select className="filter-select">
          <option>All Statuses</option>
          <option>Open</option>
          <option>Closed</option>
        </select>
        <select className="filter-select">
          <option>All Tags</option>
          <option>Remote</option>
          <option>Full Time</option>
          <option>Internship</option>
        </select>
      </div>

      <JobList />

      {isModalOpen && (
        <JobFormModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

export default JobsPage;
