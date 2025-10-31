import React, { useEffect, useState } from "react";
import { makeSlug } from "./JobsData";

import "./Jobs.css";

export default function JobFormModal({ job = null, onClose, onCreate, onUpdate, existingJobs = [] }) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    posted: new Date().toLocaleDateString(),
    description: "",
    tags: "",
  });

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        salaryMin: job.salaryMin || "",
        salaryMax: job.salaryMax || "",
        posted: job.posted || new Date().toLocaleDateString(),
        description: job.description || "",
        tags: (job.tags || []).join(", "),
      });
    }
  }, [job]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Title is required.");

    const slug = makeSlug(form.title);
    const duplicate = existingJobs.find((j) => j.slug === slug && (!job || j.id !== job.id));
    if (duplicate) return alert("A job with a similar title already exists. Please change title.");

    const payload = {
      id: job ? job.id : Date.now(),
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      salaryMin: form.salaryMin,
      salaryMax: form.salaryMax,
      posted: form.posted,
      description: form.description,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      archived: job ? !!job.archived : false,
      slug,
    };

    if (job) onUpdate(payload);
    else onCreate(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{job ? "Edit Job" : "Create Job"}</h3>
        <form onSubmit={submit} className="jobform">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Job title *" />
          <input name="company" value={form.company} onChange={handleChange} placeholder="Company" />
          <input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
          <div className="two-cols">
            <input name="salaryMin" value={form.salaryMin} onChange={handleChange} placeholder="Min salary" />
            <input name="salaryMax" value={form.salaryMax} onChange={handleChange} placeholder="Max salary" />
          </div>
          <input name="posted" value={form.posted} onChange={handleChange} placeholder="Posted date" />
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma-separated)" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Short description" />
          <div className="modal-actions">
            <button type="submit" className="primary-btn">{job ? "Save" : "Create"}</button>
            <button type="button" onClick={onClose} className="muted-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
