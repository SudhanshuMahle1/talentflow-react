import React from "react";
import "./CandidateApplications.css";

function CandidateApplications() {
  // Sample data for each category
  const acceptedApplications = [
    {
      company: "Google",
      role: "Frontend Developer",
      date: "Oct 20, 2025",
      location: "Bangalore, India",
      status: "Accepted",
    },
    {
      company: "Microsoft",
      role: "Cloud Engineer",
      date: "Oct 25, 2025",
      location: "Hyderabad, India",
      status: "Accepted",
    },
    {
      company: "Techify",
      role: "Data Scientist",
      date: "Oct 28, 2025",
      location: "Remote",
      status: "Accepted",
    },
  ];

  const inReviewApplications = [
    {
      company: "Tata Consultancy Services",
      role: "Backend Developer",
      date: "Oct 29, 2025",
      location: "Pune, India",
      status: "In Review",
    },
    {
      company: "Wipro",
      role: "DevOps Engineer",
      date: "Oct 27, 2025",
      location: "Delhi, India",
      status: "In Review",
    },
    {
      company: "Infosys",
      role: "AI Research Intern",
      date: "Oct 26, 2025",
      location: "Chennai, India",
      status: "Pending",
    },
  ];

  const rejectedApplications = [
    {
      company: "Amazon",
      role: "Backend Developer",
      date: "Oct 12, 2025",
      location: "Pune, India",
      status: "Rejected",
    },
    {
      company: "CodeNest",
      role: "UI/UX Designer",
      date: "Oct 15, 2025",
      location: "Delhi, India",
      status: "Rejected",
    },
    {
      company: "Innovate Labs",
      role: "Machine Learning Engineer",
      date: "Oct 18, 2025",
      location: "Chennai, India",
      status: "Rejected",
    },
  ];

  return (
    <div className="candidate-applications">
      <h2>My Applications</h2>

      {/* Accepted Applications */}
      <div className="applications-section accepted">
        <h3>Accepted Applications</h3>
        <div className="applications-grid">
          {acceptedApplications.map((app, index) => (
            <div key={index} className="application-card accepted-card">
              <h4>{app.role}</h4>
              <p><strong>Company:</strong> {app.company}</p>
              <p><strong>Location:</strong> {app.location}</p>
              <p><strong>Date:</strong> {app.date}</p>
              <p className="status accepted">{app.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* In Review / Pending Applications */}
      <div className="applications-section review">
        <h3>In Review / Pending Applications</h3>
        <div className="applications-grid">
          {inReviewApplications.map((app, index) => (
            <div key={index} className="application-card review-card">
              <h4>{app.role}</h4>
              <p><strong>Company:</strong> {app.company}</p>
              <p><strong>Location:</strong> {app.location}</p>
              <p><strong>Date:</strong> {app.date}</p>
              <p className="status review">{app.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rejected Applications */}
      <div className="applications-section rejected">
        <h3>Rejected Applications</h3>
        <div className="applications-grid">
          {rejectedApplications.map((app, index) => (
            <div key={index} className="application-card rejected-card">
              <h4>{app.role}</h4>
              <p><strong>Company:</strong> {app.company}</p>
              <p><strong>Location:</strong> {app.location}</p>
              <p><strong>Date:</strong> {app.date}</p>
              <p className="status rejected">{app.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CandidateApplications;
