import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Candidates.css";
import CandidateList from "./CandidateList";
import CandidateDetail from "./CandidateDetail";
import candidatesData from "./candidatesData";

const Candidates = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("All Stages");
  const [skillFilter, setSkillFilter] = useState("All Skills");
  const [experienceFilter, setExperienceFilter] = useState("All Experience");
  const [candidates, setCandidates] = useState(candidatesData);
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // ✅ Filtering logic
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage =
      stageFilter === "All Stages" || c.stage === stageFilter;
    const matchesSkill =
      skillFilter === "All Skills" || c.skills.includes(skillFilter);
    const matchesExperience =
      experienceFilter === "All Experience" ||
      c.experience === experienceFilter;

    return matchesSearch && matchesStage && matchesSkill && matchesExperience;
  });

  // ✅ Add new candidate
  const handleAddCandidate = (e) => {
    e.preventDefault();
    const form = e.target;
    const newCandidate = {
      id: candidates.length + 1,
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      location: form.location.value,
      experience: form.experience.value,
      skills: form.skills.value.split(",").map((s) => s.trim()),
      stage: "Applied",
      statusHistory: [
        { stage: "Applied", date: new Date().toLocaleDateString() },
      ],
    };
    setCandidates([newCandidate, ...candidates]);
    setShowModal(false);
    form.reset();
  };

  return (
    <div className="candidates-container">
      {/* Header */}
      <div className="candidates-header">
        <div>
          <h2 className="candidates-title">Candidates</h2>
          <p className="candidates-subtitle">
            Browse and manage your candidate database.
          </p>
        </div>
        <button className="add-candidate-btn" onClick={() => setShowModal(true)}>
          + Add Candidate
        </button>
      </div>

      {/* Filters */}
      <div className="candidates-filters">
        <input
          type="text"
          placeholder="Search by name/email..."
          className="candidates-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="candidates-select"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
        >
          <option>All Stages</option>
          <option>Applied</option>
          <option>Interviewing</option>
          <option>Hired</option>
          <option>Rejected</option>
        </select>
        <select
          className="candidates-select"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
        >
          <option>All Skills</option>
          <option>React</option>
          <option>Python</option>
          <option>Data Analysis</option>
        </select>
        <select
          className="candidates-select"
          value={experienceFilter}
          onChange={(e) => setExperienceFilter(e.target.value)}
        >
          <option>All Experience</option>
          <option>1 year</option>
          <option>3 years</option>
          <option>5 years</option>
          <option>10 years</option>
        </select>
      </div>

      {/* Candidate count */}
      <p className="candidates-count">
        {filteredCandidates.length} candidates found
      </p>

      {/* Candidate list */}
      <CandidateList
        candidates={filteredCandidates}
        onView={(candidate) => navigate(`/candidates/${candidate.id}`)}
      />

      {/* ✅ Add Candidate Modal */}
      {showModal && (
        <div className="candidate-modal-overlay">
          <div className="candidate-modal">
            <h3>Add New Candidate</h3>
            <form onSubmit={handleAddCandidate}>
              <input name="name" placeholder="Full Name" required />
              <input name="email" placeholder="Email" required />
              <input name="phone" placeholder="Phone" required />
              <input name="location" placeholder="Location" required />
              <input
                name="experience"
                placeholder="Experience (e.g., 5 years)"
                required
              />
              <input
                name="skills"
                placeholder="Skills (comma separated)"
                required
              />
              <div className="modal-buttons">
                <button type="submit">Add</button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Detail Modal (kept for backward compatibility) */}
      {selectedCandidate && (
        <CandidateDetail
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
};

export default Candidates;
