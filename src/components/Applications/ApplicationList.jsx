import React from "react";
import ApplicationCard from "./ApplicationCard";

const ApplicationList = ({ applications, onView }) => {
  return (
    <div className="application-list">
      {applications.map((app) => (
        <ApplicationCard key={app.id} app={app} onView={onView} />
      ))}
    </div>
  );
};

export default ApplicationList;
