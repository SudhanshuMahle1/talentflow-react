import React, { useEffect, useState } from "react";
import "./Assessment.css";

const STORAGE_KEY_BUILDER = "assessmentBuilder";
const STORAGE_KEY_RESPONSES = "assessmentResponses";

const Assessment = () => {
  const [assessment, setAssessment] = useState([]);
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BUILDER);
    if (saved) {
      try {
        setAssessment(JSON.parse(saved));
      } catch {
        setAssessment(createDemoAssessments());
      }
    } else {
      setAssessment(createDemoAssessments());
    }

    const resp = localStorage.getItem(STORAGE_KEY_RESPONSES);
    if (resp) {
      try {
        setResponses(JSON.parse(resp));
        setStatus("Saved");
      } catch {
        setResponses({});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(responses));
  }, [responses]);

  const shouldDisplayQuestion = (q) => {
    if (!q.condition) return true;
    const cond = q.condition;
    const value = responses[cond.questionId];
    if (Array.isArray(value)) return value.includes(cond.expectedAnswer);
    return value === cond.expectedAnswer;
  };

  const setAnswer = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  const toggleMultiOption = (questionId, option) => {
    const cur = responses[questionId] || [];
    if (!Array.isArray(cur)) {
      setAnswer(questionId, [option]);
      return;
    }
    if (cur.includes(option)) {
      setAnswer(
        questionId,
        cur.filter((o) => o !== option)
      );
    } else {
      setAnswer(questionId, [...cur, option]);
    }
  };

  const validateQuestion = (q) => {
    const val = responses[q.id];

    if (q.required) {
      if (q.type === "multi" && (!val || val.length === 0)) return "Required";
      if (q.type !== "multi" && !val) return "Required";
    }

    if (q.type === "numeric" && val !== undefined && val !== "") {
      const num = Number(val);
      if (isNaN(num)) return "Must be a number";
      if (q.min !== undefined && num < Number(q.min)) return `Min ${q.min}`;
      if (q.max !== undefined && num > Number(q.max)) return `Max ${q.max}`;
    }

    if ((q.type === "short" || q.type === "long") && q.maxLength) {
      if (val && val.length > q.maxLength)
        return `Max ${q.maxLength} characters`;
    }

    return null;
  };

  const validateAll = () => {
    const newErrors = {};
    assessment.forEach((section) => {
      section.questions.forEach((q) => {
        if (!shouldDisplayQuestion(q)) return;
        const err = validateQuestion(q);
        if (err) newErrors[q.id] = err;
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateAll()) {
      setStatus("Validation error");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(responses));
    setStatus("Submitted");
    alert("Assessment submitted (saved locally).");
  };

  return (
    <div className="candidate-assessment">
      <div className="assessment-card">
        <div className="assessment-head">
          <h2>Assessment</h2>
          <div className={`status-bubble status-${status.toLowerCase()}`}>
            Status: {status}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="assessment-form">
          {assessment.length === 0 ? (
            <p>No assessment available for this job.</p>
          ) : (
            assessment.map((section) => (
              <section key={section.id} className="assessment-section">
                <h3 className="section-title">{section.title}</h3>

                {section.questions.map((q) => {
                  if (!shouldDisplayQuestion(q)) return null;
                  return (
                    <div key={q.id} className="question-row">
                      <label className="q-label">
                        {q.text}
                        {q.required && <span className="req-star"> *</span>}
                      </label>

                      <div className="q-input">
                        {q.type === "short" && (
                          <input
                            type="text"
                            value={responses[q.id] || ""}
                            onChange={(e) => setAnswer(q.id, e.target.value)}
                            placeholder="Your answer..."
                          />
                        )}

                        {q.type === "long" && (
                          <textarea
                            value={responses[q.id] || ""}
                            onChange={(e) => setAnswer(q.id, e.target.value)}
                            placeholder="Your detailed answer..."
                          />
                        )}

                        {q.type === "numeric" && (
                          <input
                            type="number"
                            value={responses[q.id] || ""}
                            min={q.min || undefined}
                            max={q.max || undefined}
                            onChange={(e) => setAnswer(q.id, e.target.value)}
                            placeholder={`Number${
                              q.min ? ` (min ${q.min})` : ""
                            }`}
                          />
                        )}

                        {q.type === "file" && (
                          <div className="file-stub">
                            <input
                              type="file"
                              onChange={(e) =>
                                setAnswer(
                                  q.id,
                                  e.target.files?.[0]?.name || ""
                                )
                              }
                            />
                            <div className="file-note">
                              (File upload is a stub — only filename stored
                              locally)
                            </div>
                          </div>
                        )}

                        {q.type === "single" && (
                          <div className="options">
                            {q.options?.map((opt, i) => (
                              <label key={i} className="opt">
                                <input
                                  type="radio"
                                  name={`q_${q.id}`}
                                  value={opt}
                                  checked={responses[q.id] === opt}
                                  onChange={(e) => setAnswer(q.id, e.target.value)}
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        )}

                        {q.type === "multi" && (
                          <div className="options">
                            {q.options?.map((opt, i) => (
                              <label key={i} className="opt">
                                <input
                                  type="checkbox"
                                  checked={
                                    Array.isArray(responses[q.id]) &&
                                    responses[q.id].includes(opt)
                                  }
                                  onChange={() => toggleMultiOption(q.id, opt)}
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        )}

                        {errors[q.id] && (
                          <div className="error">{errors[q.id]}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </section>
            ))
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Submit Assessment
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY_RESPONSES);
                setResponses({});
                setStatus("Pending");
              }}
            >
              Reset Responses
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Assessment;

/* --- Demo assessments --- */
function createDemoAssessments() {
  const makeQuestion = (id, type, text, opts = {}) => ({
    id,
    type,
    text,
    required: opts.required || false,
    options: opts.options,
    maxLength: opts.maxLength,
    min: opts.min,
    max: opts.max,
    condition: opts.condition,
  });

  const A1 = {
    id: 101,
    title: "Aptitude & Reasoning",
    questions: [
      makeQuestion(1011, "single", "Do you enjoy problem solving?", {
        required: true,
        options: ["Yes", "No"],
      }),
      makeQuestion(
        1012,
        "short",
        "Briefly describe your approach to logic puzzles.",
        {
          condition: { questionId: 1011, expectedAnswer: "Yes" },
          maxLength: 250,
        }
      ),
      makeQuestion(1013, "numeric", "How many coding problems have you solved?", {
        min: 0,
        max: 10000,
      }),
      makeQuestion(1014, "single", "Which is heavier: steel or feathers?", {
        required: true,
        options: ["Steel", "Feathers", "Same weight"],
      }),
      makeQuestion(1015, "multi", "Select prime numbers:", {
        options: ["2", "3", "4", "5"],
      }),
      makeQuestion(1016, "short", "What is 7 × 8?", { required: true }),
      makeQuestion(1017, "numeric", "Estimate seconds in a day", {
        min: 0,
        max: 1000000,
      }),
      makeQuestion(1018, "long", "Solve this reasoning scenario...", {
        maxLength: 1000,
      }),
      makeQuestion(1019, "single", "Do you prefer puzzles or coding tasks?", {
        options: ["Puzzles", "Coding", "Both"],
      }),
      makeQuestion(1020, "file", "Upload supporting proof (optional)"),
    ],
  };

  const A2 = {
    id: 201,
    title: "Technical Fundamentals",
    questions: [
      makeQuestion(2011, "short", "Explain what a REST API is.", {
        required: true,
        maxLength: 500,
      }),
      makeQuestion(2012, "multi", "Select JS frameworks you know:", {
        options: ["React", "Angular", "Vue", "Svelte"],
      }),
      makeQuestion(2013, "single", "Do you use TypeScript?", {
        required: true,
        options: ["Yes", "No"],
      }),
      makeQuestion(2014, "short", "List CSS preprocessors used."),
      makeQuestion(2015, "numeric", "Years of experience with JS", {
        min: 0,
        max: 50,
      }),
      makeQuestion(2016, "long", "Describe a challenging bug you fixed.", {
        maxLength: 1000,
      }),
      makeQuestion(2017, "single", "Are you familiar with CI/CD pipelines?", {
        options: ["Yes", "No"],
      }),
      makeQuestion(2018, "short", "Preferred database (SQL/NoSQL)?"),
      makeQuestion(2019, "multi", "Tools used for testing:", {
        options: ["Jest", "Mocha", "Selenium", "Cypress"],
      }),
      makeQuestion(2020, "file", "Upload sample log/output (optional)"),
    ],
  };

  const A3 = {
    id: 301,
    title: "Personality & Communication",
    questions: [
      makeQuestion(3011, "single", "Do you like working in teams?", {
        required: true,
        options: ["Yes", "No"],
      }),
      makeQuestion(3012, "long", "Describe a time you led a team.", {
        condition: { questionId: 3011, expectedAnswer: "Yes" },
        maxLength: 800,
      }),
      makeQuestion(3013, "short", "What motivates you at work?", {
        maxLength: 300,
      }),
      makeQuestion(3014, "single", "Would you relocate if required?", {
        options: ["Yes", "No"],
      }),
      makeQuestion(3015, "multi", "Which work styles suit you?", {
        options: ["Remote", "On-site", "Hybrid", "Flexible hours"],
      }),
      makeQuestion(3016, "numeric", "How many people have you mentored?", {
        min: 0,
        max: 1000,
      }),
      makeQuestion(3017, "short", "Preferred mode of communication?"),
      makeQuestion(3018, "long", "Describe a conflict you resolved.", {
        maxLength: 1200,
      }),
      makeQuestion(3019, "file", "Attach any presentation/doc (optional)"),
      makeQuestion(3020, "single", "Are you open to feedback?", {
        options: ["Yes", "No", "Sometimes"],
      }),
    ],
  };

  return [A1, A2, A3];
}
