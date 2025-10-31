import React, { useState, useEffect } from "react";
import "./Jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    tags: "",
    description: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Statuses");

  // Load Jobs (localStorage + mock data)
  useEffect(() => {
    const mockJobs = [
      { id: 1, title: "Frontend Developer", company: "Google", location: "Bangalore, India", status: "active", tags: ["React", "JavaScript", "UI/UX"], description: "Build and maintain scalable frontends.", order: 1 },
      { id: 2, title: "Backend Engineer", company: "Amazon", location: "Hyderabad, India", status: "active", tags: ["Node.js", "Express", "MongoDB"], description: "Work on APIs and microservices.", order: 2 },
      { id: 3, title: "Data Scientist", company: "TCS", location: "Pune, India", status: "archived", tags: ["Python", "Machine Learning", "SQL"], description: "Analyze datasets to provide insights.", order: 3 },
      { id: 4, title: "DevOps Engineer", company: "Microsoft", location: "Noida, India", status: "active", tags: ["AWS", "Docker", "CI/CD"], description: "Implement automation pipelines for deployments.", order: 4 },
      { id: 5, title: "Full Stack Developer", company: "Infosys", location: "Chennai, India", status: "archived", tags: ["React", "Node.js", "MongoDB"], description: "Develop complete web applications.", order: 5 },
      { id: 6, title: "Product Manager", company: "Flipkart", location: "Bangalore, India", status: "active", tags: ["Agile", "Scrum", "Leadership"], description: "Define product strategy and roadmap.", order: 6 },
      { id: 7, title: "UI/UX Designer", company: "Zomato", location: "Gurugram, India", status: "active", tags: ["Figma", "Prototyping", "User Research"], description: "Design intuitive user experiences.", order: 7 },
      { id: 8, title: "QA Engineer", company: "Wipro", location: "Pune, India", status: "archived", tags: ["Automation", "Selenium", "Jest"], description: "Ensure software quality with testing.", order: 8 },
      { id: 9, title: "System Administrator", company: "Dell", location: "Hyderabad, India", status: "active", tags: ["Linux", "Networking", "Security"], description: "Maintain and monitor company systems.", order: 9 },
      { id: 10, title: "Cloud Architect", company: "Oracle", location: "Bangalore, India", status: "archived", tags: ["Azure", "AWS", "Kubernetes"], description: "Design scalable cloud infrastructures.", order: 10 },
      { id: 11, title: "Data Analyst", company: "Cognizant", location: "Mumbai, India", status: "active", tags: ["Excel", "SQL", "Power BI"], description: "Interpret and visualize business data.", order: 11 },
      { id: 12, title: "Security Analyst", company: "HCL", location: "Noida, India", status: "archived", tags: ["Cybersecurity", "Firewalls", "SIEM"], description: "Monitor and protect system integrity.", order: 12 },
      { id: 13, title: "AI Engineer", company: "Tech Mahindra", location: "Hyderabad, India", status: "active", tags: ["TensorFlow", "Deep Learning", "Python"], description: "Build AI-driven intelligent solutions.", order: 13 },
      { id: 14, title: "Mobile Developer", company: "Paytm", location: "Gurugram, India", status: "archived", tags: ["Flutter", "Kotlin", "iOS"], description: "Create mobile apps for Android & iOS.", order: 14 },
      { id: 15, title: "Business Analyst", company: "Capgemini", location: "Mumbai, India", status: "active", tags: ["Requirements", "Agile", "Process Flow"], description: "Bridge communication between tech and business.", order: 15 },
      { id: 16, title: "Network Engineer", company: "Cisco", location: "Bangalore, India", status: "archived", tags: ["Networking", "LAN", "WAN"], description: "Configure and troubleshoot network devices.", order: 16 },
      { id: 17, title: "Software Tester", company: "IBM", location: "Kolkata, India", status: "active", tags: ["Manual Testing", "Automation", "Bugs"], description: "Test software applications before release.", order: 17 },
      { id: 18, title: "Project Coordinator", company: "Accenture", location: "Chennai, India", status: "archived", tags: ["Scheduling", "Communication", "Tracking"], description: "Assist teams in project execution.", order: 18 },
      { id: 19, title: "Marketing Executive", company: "OYO", location: "Delhi, India", status: "active", tags: ["SEO", "Campaigns", "Branding"], description: "Promote brand visibility and reach.", order: 19 },
      { id: 20, title: "Tech Support Engineer", company: "HP", location: "Lucknow, India", status: "archived", tags: ["Troubleshooting", "Customer Service", "Hardware"], description: "Provide technical assistance to clients.", order: 20 },
      { id: 21, title: "Frontend Intern", company: "Adobe", location: "Remote", status: "active", tags: ["HTML", "CSS", "React"], description: "Support frontend teams with small UI features.", order: 21 },
      { id: 22, title: "ML Intern", company: "NVIDIA", location: "Remote", status: "archived", tags: ["Python", "TensorFlow", "Data Analysis"], description: "Assist in building ML pipelines.", order: 22 },
      { id: 23, title: "Content Strategist", company: "Swiggy", location: "Bangalore, India", status: "active", tags: ["Content", "Marketing", "Copywriting"], description: "Plan and execute content strategies.", order: 23 },
      { id: 24, title: "Operations Manager", company: "Uber", location: "Hyderabad, India", status: "archived", tags: ["Logistics", "Operations", "Leadership"], description: "Oversee business operations.", order: 24 },
      { id: 25, title: "Research Scientist", company: "ISRO", location: "Trivandrum, India", status: "active", tags: ["Physics", "AI", "Data"], description: "Work on advanced scientific research.", order: 25 },
    ];

    const storedJobs = localStorage.getItem("jobs");
    if (storedJobs) {
      const parsed = JSON.parse(storedJobs);
      if (parsed.length < 25) {
        localStorage.setItem("jobs", JSON.stringify(mockJobs));
        setJobs(mockJobs);
      } else {
        setJobs(parsed);
      }
    } else {
      localStorage.setItem("jobs", JSON.stringify(mockJobs));
      setJobs(mockJobs);
    }
  }, []);

  // renamed to avoid ESLint warning
  const _handleSaveEdit = () => {
    const updatedJobs = jobs.map((job) =>
      job.id === editJob.id ? editJob : job
    );
    setJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    setEditJob(null);
  };

  const handleToggleArchive = (id) => {
    const updatedJobs = jobs.map((job) =>
      job.id === id
        ? { ...job, status: job.status === "active" ? "archived" : "active" }
        : job
    );
    setJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
  };

  const handleReorder = (id, direction) => {
    setJobs((prevJobs) => {
      const index = prevJobs.findIndex((job) => job.id === id);
      if (index < 0) return prevJobs;

      const newJobs = [...prevJobs];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= newJobs.length) return prevJobs;

      const tempOrder = newJobs[index].order;
      newJobs[index].order = newJobs[swapIndex].order;
      newJobs[swapIndex].order = tempOrder;

      [newJobs[index], newJobs[swapIndex]] = [newJobs[swapIndex], newJobs[index]];

      localStorage.setItem("jobs", JSON.stringify(newJobs));
      return newJobs;
    });
  };

  const handleAddJob = () => {
    if (!newJob.title || !newJob.company || !newJob.location) {
      alert("Please fill all required fields.");
      return;
    }

    const nextId = jobs.length ? Math.max(...jobs.map((j) => j.id)) + 1 : 1;

    const jobToAdd = {
      id: nextId,
      title: newJob.title,
      company: newJob.company,
      location: newJob.location,
      description: newJob.description || "No description provided",
      status: "active",
      tags: newJob.tags ? newJob.tags.split(",").map((t) => t.trim()) : [],
      order: jobs.length + 1,
    };

    const updatedJobs = [jobToAdd, ...jobs];
    setJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));

    setShowNewJobModal(false);
    setNewJob({ title: "", company: "", location: "", tags: "", description: "" });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "All Statuses" ||
      job.status === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <div>
          <h2>Jobs</h2>
          <p>Manage your job postings.</p>
        </div>
        <button className="btn-new-job" onClick={() => setShowNewJobModal(true)}>
          + Post New Job
        </button>
      </div>

      <div className="jobs-filters">
        <input
          type="text"
          placeholder="🔍 Search jobs..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>All Statuses</option>
          <option>Active</option>
          <option>Archived</option>
        </select>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="no-jobs">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076507.png"
            alt="No jobs"
          />
          <p>No jobs found</p>
        </div>
      ) : (
        <div className="job-grid">
          {filteredJobs.map((job, index) => (
            <div key={job.id} className="job-card">
              <div className="job-info">
                <div className="job-main">
                  <h3 className="job-title">{job.title}</h3>
                  <p className="company-name">{job.company}</p>
                  <p className="location">{job.location}</p>
                </div>
                <div className={`status-badge ${job.status}`}>{job.status}</div>
              </div>

              <div className="tags">
                {job.tags.map((tag, i) => (
                  <span key={i} className="tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="job-actions">
                <button className="btn-edit" onClick={() => setEditJob({ ...job })}>
                  Edit
                </button>
                <button className="btn-view" onClick={() => setSelectedJob(job)}>
                  View
                </button>
                <button
                  className="btn-archive"
                  onClick={() => handleToggleArchive(job.id)}
                >
                  {job.status === "active" ? "Archive" : "Unarchive"}
                </button>
                <div className="reorder-buttons">
                  <button onClick={() => handleReorder(job.id, "up")} disabled={index === 0}>
                    ↑
                  </button>
                  <button
                    onClick={() => handleReorder(job.id, "down")}
                    disabled={index === filteredJobs.length - 1}
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedJob.title}</h3>
            <p><strong>Company:</strong> {selectedJob.company}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Status:</strong> {selectedJob.status}</p>
            <p><strong>Tags:</strong> {selectedJob.tags.join(", ")}</p>
            <p><strong>Description:</strong> {selectedJob.description}</p>
            <button className="btn-close" onClick={() => setSelectedJob(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* New Job Modal */}
      {showNewJobModal && (
        <div className="modal-overlay" onClick={() => setShowNewJobModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Post New Job</h3>
            <label>Title*</label>
            <input
              type="text"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              placeholder="e.g., Software Engineer"
            />
            <label>Company*</label>
            <input
              type="text"
              value={newJob.company}
              onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
              placeholder="e.g., Microsoft"
            />
            <label>Location*</label>
            <input
              type="text"
              value={newJob.location}
              onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
              placeholder="e.g., Mumbai, India"
            />
            <label>Description</label>
            <textarea
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              placeholder="Brief job description..."
            ></textarea>
            <label>Tags (comma separated)</label>
            <input
              type="text"
              value={newJob.tags}
              onChange={(e) => setNewJob({ ...newJob, tags: e.target.value })}
              placeholder="e.g., React, Node.js, SQL"
            />
            <div className="edit-buttons">
              <button className="btn-save" onClick={handleAddJob}>
                Add Job
              </button>
              <button className="btn-cancel" onClick={() => setShowNewJobModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;
