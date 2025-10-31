import React from "react";
import { Virtuoso } from "react-virtuoso";
import CandidateCard from "./CandidateCard";
import "./Candidates.css";

const CandidateList = ({ candidates, onView }) => {
  if (candidates.length === 0) {
    return <p className="no-candidates">No candidates found.</p>;
  }

  return (
    <Virtuoso
      style={{ height: "70vh" }}
      totalCount={candidates.length}
      itemContent={(index) => {
        const candidate = candidates[index];
        return (
          <div
            key={candidate.id}
            className="candidate-item"
            onClick={() => onView(candidate)}
          >
            <CandidateCard candidate={candidate} />
          </div>
        );
      }}
    />
  );
};

export default CandidateList;
