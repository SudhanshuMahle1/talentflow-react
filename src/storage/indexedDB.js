import Dexie from "dexie";



const DB_NAME = "talentflow_db_v1";
const db = new Dexie(DB_NAME);

db.version(1).stores({
  jobs: "id, title, slug, order, status, archived, updatedAt",
  candidates: "id, name, email, stage, updatedAt",
  assessments: "id, jobId, title, updatedAt",
  responses: "id, assessmentId, candidateId, submittedAt",
  timelines: "++id, entityType, entityId, ts",
});

const now = () => new Date().toISOString();

export async function initDBIfNeeded({ seedJobs = true, seedCandidates = true, seedAssessments = true } = {}) {
  try {
    const jobsCount = await db.jobs.count();
    if (jobsCount === 0 && seedJobs) {
      const jobs = Array.from({ length: 25 }).map((_, i) => {
        const id = String(i + 1);
        return {
          id,
          title: `Sample Job ${i + 1}`,
          slug: `sample-job-${i + 1}`,
          order: i + 1,
          status: "open",
          archived: false,
          tags: ["frontend", "react"].slice(0, (i % 3) + 1),
          createdAt: now(),
          updatedAt: now(),
        };
      });
      await db.jobs.bulkPut(jobs);
    }

    const cCount = await db.candidates.count();
    if (cCount === 0 && seedCandidates) {
      const candidates = Array.from({ length: 1000 }).map((_, i) => {
        const id = String(10000 + i + 1);
        return {
          id,
          name: `Candidate ${i + 1}`,
          email: `candidate${i + 1}@example.com`,
          stage: ["applied", "screening", "interviewing", "offer", "hired"][i % 5],
          metadata: {},
          statusHistory: [{ stage: "applied", at: now() }],
          updatedAt: now(),
        };
      });
      await db.candidates.bulkPut(candidates);
    }

    const aCount = await db.assessments.count();
    if (aCount === 0 && seedAssessments) {
      const assessments = [
        {
          id: "A1",
          jobId: "1",
          title: "General Aptitude",
          sections: [
            {
              id: "s1",
              title: "Basics",
              questions: [
                { id: "q1", type: "single", question: "What is 2+2?", options: ["3", "4", "5"], required: true },
                { id: "q2", type: "short", question: "Tell us about yourself", required: false },
              ],
            },
          ],
          updatedAt: now(),
        },
        { id: "A2", jobId: "2", title: "Frontend Skills", sections: [], updatedAt: now() },
        { id: "A3", jobId: "3", title: "Backend Skills", sections: [], updatedAt: now() },
      ];
      await db.assessments.bulkPut(assessments);
    }
  } catch (e) {
    console.error("initDBIfNeeded error", e);
  }
}

/* Jobs */
export async function getJobs({ page = 1, pageSize = 10, q = "", status, tags } = {}) {
  let collection = db.jobs.orderBy("order");
  if (q) {
    collection = collection.filter((j) => (j.title || "").toLowerCase().includes(q.toLowerCase()));
  }
  if (status) {
    collection = collection.filter((j) => j.status === status);
  }
  if (tags && tags.length) {
    collection = collection.filter((j) => (j.tags || []).some((t) => tags.includes(t)));
  }
  const total = await collection.count();
  const items = await collection.offset((page - 1) * pageSize).limit(pageSize).toArray();
  return { items, total };
}

export async function getJob(id) {
  return db.jobs.get(id);
}

export async function addJob(job) {
  const payload = { ...job, createdAt: now(), updatedAt: now() };
  await db.jobs.put(payload);
  return payload;
}

export async function updateJob(id, patch) {
  patch.updatedAt = now();
  await db.jobs.update(id, patch);
  return db.jobs.get(id);
}

export async function reorderJobs(orderMap) {
  if (Array.isArray(orderMap)) {
    const ops = orderMap.map((o) => db.jobs.update(o.id, { order: o.order, updatedAt: now() }));
    await Promise.all(ops);
  } else if (orderMap && orderMap.id) {
    await db.jobs.update(orderMap.id, { order: orderMap.order, updatedAt: now() });
  }
  return true;
}

/* Candidates */
export async function getCandidates({ page = 1, pageSize = 50, q = "", stage } = {}) {
  let collection = db.candidates.orderBy("id");
  if (q) collection = collection.filter((c) => (c.name || "").toLowerCase().includes(q.toLowerCase()) || (c.email || "").toLowerCase().includes(q.toLowerCase()));
  if (stage) collection = collection.filter((c) => c.stage === stage);
  const total = await collection.count();
  const items = await collection.offset((page - 1) * pageSize).limit(pageSize).toArray();
  return { items, total };
}

export async function getCandidate(id) {
  return db.candidates.get(id);
}

export async function updateCandidate(id, patch) {
  patch.updatedAt = now();
  await db.candidates.update(id, patch);
  return db.candidates.get(id);
}

/* Assessments */
export async function getAssessmentsForJob(jobId) {
  if (!jobId) return db.assessments.toArray();
  return db.assessments.where({ jobId }).toArray();
}

export async function getAssessment(id) {
  return db.assessments.get(id);
}

export async function saveAssessment(assessment) {
  assessment.updatedAt = now();
  await db.assessments.put(assessment);
  return assessment;
}

/* Responses & timelines */
export async function saveResponse(response) {
  response.submittedAt = now();
  const id = response.id || `${response.assessmentId}-${response.candidateId}-${Date.now()}`;
  await db.responses.put({ ...response, id });
  return { ...response, id };
}

export async function addTimelineEntry({ entityType, entityId, event, meta = {} }) {
  const ts = new Date().toISOString();
  const id = await db.timelines.add({ entityType, entityId, event, meta, ts });
  return { id, entityType, entityId, event, meta, ts };
}

export async function getTimeline(entityType, entityId) {
  return db.timelines.where({ entityType, entityId }).toArray();
}

export default {
  db,
  initDBIfNeeded,
  getJobs,
  getJob,
  addJob,
  updateJob,
  reorderJobs,
  getCandidates,
  getCandidate,
  updateCandidate,
  getAssessmentsForJob,
  getAssessment,
  saveAssessment,
  saveResponse,
  addTimelineEntry,
  getTimeline,
};
