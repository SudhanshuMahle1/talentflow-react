import React, { useState, useEffect } from "react";
import "./AssessmentBuild.css";

const AssessmentBuild = () => {
  const [sections, setSections] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // Load existing data or add sample assessment
  useEffect(() => {
    const saved = localStorage.getItem("assessmentBuilder");
    if (saved) {
      setSections(JSON.parse(saved));
    } else {
      const sample = [
        {
          id: 1,
          title: "General Aptitude",
          questions: [
            {
              id: 11,
              type: "single",
              text: "What is the capital of France?",
              required: true,
              options: ["Berlin", "Madrid", "Paris", "Lisbon"],
            },
            {
              id: 12,
              type: "numeric",
              text: "What is 12 + 8?",
              required: true,
              min: 0,
              max: 100,
            },
          ],
        },
        {
          id: 2,
          title: "Technical Knowledge",
          questions: [
            {
              id: 21,
              type: "short",
              text: "Explain what a REST API is.",
              required: true,
            },
            {
              id: 22,
              type: "multi",
              text: "Select JavaScript frameworks you know:",
              required: false,
              options: ["React", "Angular", "Vue", "Svelte"],
            },
          ],
        },
      ];
      setSections(sample);
      localStorage.setItem("assessmentBuilder", JSON.stringify(sample));
    }
  }, []);

  // Add new section
  const addSection = () => {
    const newSection = {
      id: Date.now(),
      title: `Section ${sections.length + 1}`,
      questions: [],
    };
    setSections([...sections, newSection]);
  };

  // Add question to a section
  const addQuestion = (sectionId, type) => {
    const updatedSections = sections.map((sec) => {
      if (sec.id === sectionId) {
        const newQuestion = {
          id: Date.now(),
          type,
          text: "",
          required: false,
          options: ["Option 1"],
          min: "",
          max: "",
        };
        return { ...sec, questions: [...sec.questions, newQuestion] };
      }
      return sec;
    });
    setSections(updatedSections);
  };

  // Handle question change
  const handleQuestionChange = (sectionId, questionId, field, value) => {
    const updatedSections = sections.map((sec) => {
      if (sec.id === sectionId) {
        const updatedQuestions = sec.questions.map((q) =>
          q.id === questionId ? { ...q, [field]: value } : q
        );
        return { ...sec, questions: updatedQuestions };
      }
      return sec;
    });
    setSections(updatedSections);
  };

  // Add new option
  const addOption = (sectionId, questionId) => {
    const updatedSections = sections.map((sec) => {
      if (sec.id === sectionId) {
        const updatedQuestions = sec.questions.map((q) =>
          q.id === questionId
            ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
            : q
        );
        return { ...sec, questions: updatedQuestions };
      }
      return sec;
    });
    setSections(updatedSections);
  };

  // Save builder
  const saveAssessment = () => {
    localStorage.setItem("assessmentBuilder", JSON.stringify(sections));
    alert("✅ Assessment saved locally!");
  };

  return (
    <div className="assessment-builder-container">
      <div className="builder-header">
        <h2>Assessment Builder</h2>
        <div className="builder-actions">
          <button className="btn add-section-btn" onClick={addSection}>
            + Add Section
          </button>
          <button
            className="btn preview-btn"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Back to Builder" : "Preview Form"}
          </button>
          <button className="btn save-btn" onClick={saveAssessment}>
            💾 Save
          </button>
        </div>
      </div>

      {!showPreview ? (
        <div className="builder-sections">
          {sections.map((section) => (
            <div key={section.id} className="section-block">
              <h3>{section.title}</h3>

              <div className="question-type-buttons">
                {["single", "multi", "short", "long", "numeric", "file"].map(
                  (type) => (
                    <button
                      key={type}
                      className="btn type-btn"
                      onClick={() => addQuestion(section.id, type)}
                    >
                      + {type} choice
                    </button>
                  )
                )}
              </div>

              {section.questions.map((q) => (
                <div key={q.id} className="question-block">
                  <input
                    type="text"
                    placeholder="Enter question text..."
                    value={q.text}
                    onChange={(e) =>
                      handleQuestionChange(
                        section.id,
                        q.id,
                        "text",
                        e.target.value
                      )
                    }
                  />
                  <label className="required-label">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) =>
                        handleQuestionChange(
                          section.id,
                          q.id,
                          "required",
                          e.target.checked
                        )
                      }
                    />{" "}
                    Required
                  </label>

                  {["single", "multi"].includes(q.type) && (
                    <>
                      {q.options.map((opt, i) => (
                        <input
                          key={i}
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const opts = [...q.options];
                            opts[i] = e.target.value;
                            handleQuestionChange(section.id, q.id, "options", opts);
                          }}
                        />
                      ))}
                      <button
                        className="btn small-btn"
                        onClick={() => addOption(section.id, q.id)}
                      >
                        + Add Option
                      </button>
                    </>
                  )}

                  {q.type === "numeric" && (
                    <div className="numeric-range">
                      <input
                        type="number"
                        placeholder="Min"
                        value={q.min}
                        onChange={(e) =>
                          handleQuestionChange(section.id, q.id, "min", e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={q.max}
                        onChange={(e) =>
                          handleQuestionChange(section.id, q.id, "max", e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="preview-pane">
          <h3>Live Preview</h3>
          {sections.map((section) => (
            <div key={section.id} className="preview-section">
              <h4>{section.title}</h4>
              {section.questions.map((q) => (
                <div key={q.id} className="preview-question">
                  <label>
                    {q.text}
                    {q.required && <span className="required">*</span>}
                  </label>
                  {q.type === "short" && <input type="text" />}
                  {q.type === "long" && <textarea />}
                  {q.type === "file" && <input type="file" />}
                  {q.type === "numeric" && <input type="number" />}
                  {q.type === "single" &&
                    q.options.map((opt, i) => (
                      <div key={i}>
                        <input type="radio" name={q.id} />
                        <label>{opt}</label>
                      </div>
                    ))}
                  {q.type === "multi" &&
                    q.options.map((opt, i) => (
                      <div key={i}>
                        <input type="checkbox" />
                        <label>{opt}</label>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssessmentBuild;
