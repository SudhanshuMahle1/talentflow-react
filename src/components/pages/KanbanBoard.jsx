import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import "./KanbanBoard.css"; 

export default function KanbanBoard() {
  const stages = ["Applied", "Screening", "Interviewing", "Offer", "Hired"];
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const dragItem = useRef(null);

 
  const fetchCandidates = useCallback(async (retryCount = 0) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get("/api/candidates?page=1&pageSize=1000");
      const fixed = (res.data.candidates || []).map((c) => ({
        ...c,
        email: c.email.replace("@example.com", "@email.com"),
      }));
      setCandidates(fixed);
    } catch (err) {
      console.error("Failed to load candidates", err);

      // Retry logic (max 3 times)
      if (retryCount < 3) {
        setTimeout(() => fetchCandidates(retryCount + 1), 1200);
        return;
      }

      setError("⚠️ Failed to load candidates. Please refresh or check server.");
    } finally {
      setLoading(false);
    }
  }, []);

  
  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const candidatesByStage = (stage) =>
    candidates
      .filter((c) => c.stage?.toLowerCase() === stage.toLowerCase())
      .filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
      );

  const updateCandidateLocally = (id, patch) =>
    candidates.map((c) => (c.id === id ? { ...c, ...patch } : c));

  async function moveCandidateToStage(candidateId, newStage) {
    const prev = candidates;
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate || candidate.stage === newStage) return;

    const updatedLocal = updateCandidateLocally(candidateId, { stage: newStage });
    setCandidates(updatedLocal);
    setSaving(true);

    try {
      await axios.patch(`/api/candidates/${candidateId}`, { stage: newStage });
    } catch (err) {
      console.error("Stage update failed:", err);
      setCandidates(prev);
      alert(`Failed to move ${candidate.name} to ${newStage}. Changes reverted.`);
    } finally {
      setSaving(false);
    }
  }

  const handleDragStart = (e, candidate) => {
    dragItem.current = candidate;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", candidate.id);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    const candidateId = e.dataTransfer.getData("text/plain");
    if (candidateId) moveCandidateToStage(candidateId, targetStage);
    dragItem.current = null;
  };

  return (
    <div className="kanban-wrapper">
      {/* Header */}
      <div className="kanban-header">
        <h2>Candidates Board</h2>
        <button onClick={fetchCandidates} disabled={loading || saving}>
          {loading ? "Loading..." : "Refresh"}
        </button>
        {saving && <small className="saving-text">Saving changes…</small>}
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search candidates by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="kanban-search"
      />

      {/* Error */}
      {error && <div className="error-text">{error}</div>}

      {/* Loading */}
      {loading ? (
        <div className="loading-text">Loading candidates…</div>
      ) : (
        <div className="kanban-container">
          {stages.map((stage) => (
            <div
              key={stage}
              className="kanban-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <h3>{stage}</h3>
              <div className="kanban-list">
                {candidatesByStage(stage).map((candidate) => (
                  <div
                    key={candidate.id}
                    className="kanban-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate)}
                  >
                    <h4>{candidate.name}</h4>
                    <div className="kanban-email">{candidate.email}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
