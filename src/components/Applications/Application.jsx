import React, { useState } from "react";
import ApplicationList from "./ApplicationList";
import ApplicationDetail from "./ApplicationDetail";
import "./Application.css";
import applicationsData from "./applicationsData";

const Application = ({ role }) => { //  added prop
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selectedApp, setSelectedApp] = useState(null);

  // If role = candidate, show only their applications 
  const candidateName = "John Doe"; 
  const visibleApplications =
    role === "candidate"
      ? applicationsData.filter((app) => app.name === candidateName)
      : applicationsData;

  const filteredApplications = visibleApplications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Statuses" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="applications-container">
      <h2 className="applications-title">Applications</h2>
      <p className="applications-subtitle">
        Manage all job applications and track candidate progress.
      </p>

      <div className="applications-filters">
        <input
          type="text"
          placeholder="Search applications..."
          className="applications-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="applications-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Statuses</option>
          <option>Interview</option>
          <option>Rejected</option>
          <option>Shortlisted</option>
        </select>
      </div>

      <p className="applications-count">
        {filteredApplications.length} applications found
      </p>

      <ApplicationList
        applications={filteredApplications}
        onView={setSelectedApp}
      />

      {selectedApp && (
        <ApplicationDetail app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
    </div>
  );
};

export default Application;
