import React, { useEffect, useState, useRef } from "react";
import {
  fetchJobs,
  reorderJobs,
  fetchJobById,
  toggleArchiveJob,
} from "./jobsData";
import "./job.css"; // 

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const dragSourceIndexRef = useRef(null);

  // -------------------- Load --------------------
  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchJobs({ page: 1, pageSize: 1000 });
      const sorted = (list || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
      setJobs(sorted);
    } catch (err) {
      console.error("Failed to load jobs", err);
      setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }

  // -------------------- Helpers --------------------
  const normalizeOrder = (arr) => arr.map((j, idx) => ({ ...j, order: idx + 1 }));

  const applyLocalReorderByIndex = (localJobs, sourceIndex, destIndex) => {
    const arr = localJobs.slice();
    const [moved] = arr.splice(sourceIndex, 1);
    arr.splice(destIndex, 0, moved);
    return normalizeOrder(arr);
  };

  async function performOptimisticReorder(newJobs) {
    const prev = jobs;
    setJobs(newJobs);
    setSaving(true);
    setError(null);
    try {
      const payload = newJobs.map((j) => ({ id: j.id, order: j.order }));
      await reorderJobs(payload);
    } catch (err) {
      console.error("Reorder failed:", err);
      setJobs(prev); // rollback
      setError("Failed to save order — reverted.");
      alert("Failed to reorder on server — reverted changes.");
    } finally {
      setSaving(false);
    }
  }

  const handleMoveUp = (index) => {
    if (index <= 0) return;
    const newJobs = applyLocalReorderByIndex(jobs, index, index - 1);
    performOptimisticReorder(newJobs);
  };

  const handleMoveDown = (index) => {
    if (index >= jobs.length - 1) return;
    const newJobs = applyLocalReorderByIndex(jobs, index, index + 1);
    performOptimisticReorder(newJobs);
  };

  async function handleToggleArchive(job) {
    const prev = jobs;
    const patched = jobs.map((j) => (j.id === job.id ? { ...j, archived: !j.archived } : j));
    setJobs(patched);
    try {
      await toggleArchiveJob(job.id, !job.archived);
    } catch (err) {
      console.error("Archive toggle failed", err);
      setJobs(prev);
      alert("Failed to update archive state — reverted.");
    }
  }

  const handleDragStart = (e, index) => {
    dragSourceIndexRef.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, destIndex) => {
    e.preventDefault();
    const sourceIndex =
      dragSourceIndexRef.current !== null
        ? dragSourceIndexRef.current
        : parseInt(e.dataTransfer.getData("text/plain"), 10);
    dragSourceIndexRef.current = null;
    if (isNaN(sourceIndex) || sourceIndex === destIndex) return;
    const newJobs = applyLocalReorderByIndex(jobs, sourceIndex, destIndex);
    performOptimisticReorder(newJobs);
  };

  const handleDragEnd = () => {
    dragSourceIndexRef.current = null;
  };

  const handleRefresh = () => loadJobs();

  const openJob = async (jobId) => {
    try {
      const job = await fetchJobById(jobId);
      alert(`Open job: ${job?.title || jobId}`);
    } catch (err) {
      console.error("Open job failed", err);
    }
  };

  // -------------------- Render --------------------
  return (
    <div className="joblist-container">
      {/* Header */}
      <div className="joblist-header">
        <h2>Jobs</h2>
        <button onClick={handleRefresh} disabled={loading || saving}>
          Refresh
        </button>
        {saving && <small className="saving-text">Saving order…</small>}
      </div>

      {/* Error */}
      {error && <div className="error-text">{error}</div>}

      {/* Loading */}
      {loading ? (
        <div className="loading-text">Loading jobs…</div>
      ) : (
        <ul className="joblist">
          {jobs.map((job, idx) => (
            <li
              key={job.id}
              className={`job-item ${job.archived ? "archived" : ""}`}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
            >
              <div className="job-order">{job.order}</div>

              <div className="job-details" onDoubleClick={() => openJob(job.id)}>
                <div className="job-title">{job.title}</div>
                <div className="job-slug">
                  {job.slug || ""} {job.archived ? "— archived" : ""}
                </div>
              </div>

              <div className="job-actions">
                <button
                  onClick={() => handleMoveUp(idx)}
                  disabled={idx === 0 || saving}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMoveDown(idx)}
                  disabled={idx === jobs.length - 1 || saving}
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={() => handleToggleArchive(job)}
                  disabled={saving}
                  title={job.archived ? "Unarchive" : "Archive"}
                >
                  {job.archived ? "Unarchive" : "Archive"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="joblist-footer">
        Drag jobs to reorder or use the arrows. Changes are saved automatically and revert if the simulated server (Mirage) fails.
      </div>
    </div>
  );
}
