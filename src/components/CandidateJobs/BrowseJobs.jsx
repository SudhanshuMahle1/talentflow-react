import React, { useState, useEffect } from "react";
import "./BrowseJobs.css";

function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLocation, setFilterLocation] = useState("All Locations");
  const [filterCompany, setFilterCompany] = useState("All Companies");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [candidate, setCandidate] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Function to load active jobs from localStorage
  const loadJobs = () => {
    const storedJobs = localStorage.getItem("jobs");
    if (storedJobs) {
      const allJobs = JSON.parse(storedJobs);
      const activeJobs = allJobs.filter((job) => job.status === "active");
      setJobs(activeJobs);
    } else {
      setJobs([]);
    }
  };

  // Load jobs
  useEffect(() => {
    loadJobs();

    // updates in localStorage 
    const handleStorageChange = (event) => {
      if (event.key === "jobs") {
        loadJobs();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Search + Filter logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      filterLocation === "All Locations" ||
      job.location.toLowerCase() === filterLocation.toLowerCase();

    const matchesCompany =
      filterCompany === "All Companies" ||
      job.company.toLowerCase() === filterCompany.toLowerCase();

    return matchesSearch && matchesLocation && matchesCompany;
  });

  // Unique dropdown filters
  const uniqueCompanies = ["All Companies", ...new Set(jobs.map((j) => j.company))];
  const uniqueLocations = ["All Locations", ...new Set(jobs.map((j) => j.location))];

  // Handle Apply
  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyForm(true);
  };

  // Submit Application
  const handleSubmitApplication = () => {
    if (!candidate.name || !candidate.email || !candidate.phone) {
      alert("Please fill all fields.");
      return;
    }

    const applications = JSON.parse(localStorage.getItem("applications")) || [];

    const newApp = {
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      company: selectedJob.company,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      candidatePhone: candidate.phone,
      appliedAt: new Date().toLocaleString(),
      status: "Pending",
    };

    const updatedApps = [...applications, newApp];
    localStorage.setItem("applications", JSON.stringify(updatedApps));

    alert("✅ Application submitted successfully!");
    setShowApplyForm(false);
    setCandidate({ name: "", email: "", phone: "" });
  };

  return (
    <div className="browse-container">
      <div className="browse-header">
        <h2>Available Jobs</h2>
        <p>Explore and apply for active job postings.</p>
      </div>

      {/* Filters */}
      <div className="browse-filters">
        <input
          type="text"
          placeholder="🔍 Search jobs..."
          className="browse-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="browse-select"
        >
          {uniqueLocations.map((loc, i) => (
            <option key={i}>{loc}</option>
          ))}
        </select>
        <select
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
          className="browse-select"
        >
          {uniqueCompanies.map((comp, i) => (
            <option key={i}>{comp}</option>
          ))}
        </select>
      </div>

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <div className="no-jobs">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076507.png"
            alt="No jobs"
          />
          <p>No jobs available right now.</p>
        </div>
      ) : (
        <div className="browse-grid">
          {filteredJobs.map((job) => (
            <div key={job.id} className="browse-card">
              <h3>{job.title}</h3>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Tags:</strong> {job.tags?.join(", ") || "N/A"}</p>
              <button className="btn-apply" onClick={() => handleApply(job)}>
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Apply Form Modal */}
      {showApplyForm && selectedJob && (
        <div className="modal-overlay" onClick={() => setShowApplyForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Apply for {selectedJob.title}</h3>
            <label>Name*</label>
            <input
              type="text"
              value={candidate.name}
              onChange={(e) => setCandidate({ ...candidate, name: e.target.value })}
              placeholder="Enter your name"
            />
            <label>Email*</label>
            <input
              type="email"
              value={candidate.email}
              onChange={(e) => setCandidate({ ...candidate, email: e.target.value })}
              placeholder="Enter your email"
            />
            <label>Phone*</label>
            <input
              type="tel"
              value={candidate.phone}
              onChange={(e) => setCandidate({ ...candidate, phone: e.target.value })}
              placeholder="Enter your number"
            />

            <div className="edit-buttons">
              <button className="btn-save" onClick={handleSubmitApplication}>
                Submit
              </button>
              <button className="btn-cancel" onClick={() => setShowApplyForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrowseJobs;
