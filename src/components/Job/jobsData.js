import axios from "axios";


export async function fetchJobs({ page = 1, pageSize = 10, q = "", status = "", tags = [] } = {}) {
  const params = new URLSearchParams({
    page,
    pageSize,
    q,
  });
  if (status) params.append("status", status);
  if (tags.length > 0) params.append("tags", tags.join(","));

  try {
    const res = await axios.get(`/api/jobs?${params.toString()}`);
    return res.data.jobs || [];
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return [];
  }
}

/* Get a single job by its ID */
export async function fetchJobById(id) {
  try {
    const res = await axios.get(`/api/jobs/${id}`);
    return res.data.job;
  } catch (err) {
    console.error("Error fetching job:", err);
    return null;
  }
}

/* Create a new job */
export async function createJob(jobData) {
  try {
    const res = await axios.post("/api/jobs", jobData);
    return res.data.job;
  } catch (err) {
    console.error("Error creating job:", err);
    throw err;
  }
}

/* Update an existing job*/
export async function updateJob(id, patch) {
  try {
    const res = await axios.patch(`/api/jobs/${id}`, patch);
    return res.data.job;
  } catch (err) {
    console.error("Error updating job:", err);
    throw err;
  }
}


export async function reorderJobs(orderMap) {
  try {
    const firstId = Array.isArray(orderMap) ? orderMap[0].id : orderMap.id;
    const res = await axios.patch(`/api/jobs/${firstId}/reorder`, orderMap);
    return res.data;
  } catch (err) {
    console.error("Error reordering jobs:", err);
    throw err;
  }
}

/* * Archive / Unarchive job */
export async function toggleArchiveJob(id, archived) {
  try {
    const res = await axios.patch(`/api/jobs/${id}`, { archived });
    return res.data.job;
  } catch (err) {
    console.error("Error archiving/unarchiving job:", err);
    throw err;
  }
}


export function makeSlug(title = "") {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
