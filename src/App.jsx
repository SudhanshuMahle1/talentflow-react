import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import About from "./components/About";
import Gallery from "./components/Gallery";
import Leaders from "./components/Leaders";
import Alumni from "./components/Alumni";
import Jobs from "./components/Job/Jobs";
import Application from "./components/Applications/Application";
import Candidates from "./components/Candidates/Candidate";
import CandidateDetail from "./components/Candidates/CandidateDetail";
import Settings from "./components/Settings/Settings";
import BrowseJobs from "./components/CandidateJobs/BrowseJobs";
import candidatesData from "./components/Candidates/candidatesData";
import KanbanBoard from "./components/pages/KanbanBoard";
import CandidateApplications from "./components/pages/CandidateApplications/CandidateApplications";
import Assessment from "./components/pages/Assessment/Assessment";
import AssessmentBuild from "./components/AssessmentBuild/AssessmentBuild";
import CandidateSettings from "./components/pages/candidateSetting/CandidateSettings";

import "./App.css";

function App() {
  const [role, setRole] = useState("admin");
  const [selectedPage, setSelectedPage] = useState("Dashboard");

  // Toggle between admin/candidate roles
  const toggleRole = () => {
    setRole((prevRole) => {
      if (prevRole === "admin") {
        setSelectedPage("Home");
        return "candidate";
      } else {
        setSelectedPage("Dashboard");
        return "admin";
      }
    });
  };

  return (
    <Router>
      <Header role={role} onToggleRole={toggleRole} />

      <div className="app-layout">
        <Sidebar
          role={role}
          onToggleRole={toggleRole}
          onSelectPage={setSelectedPage}
          selectedPage={selectedPage}
        />

        <div className="content">
          <Routes>
            {/* MAIN DASHBOARD ROUTE  */}
            <Route
              path="/"
              element={
                <>
                  {selectedPage === "Dashboard" ? (
                    <>
                      <div className="main_box">
                        <h1 className="hero_title">
                          TALENTFLOW – A MINI HIRING PLATFORM
                        </h1>
                      </div>
                      <hr />
                      <About />
                      <hr />
                      <Gallery />
                      <Leaders />
                      {role === "admin" && <Alumni />}
                    </>
                  ) : selectedPage === "Jobs" ? (
                    <Jobs />
                  ) : selectedPage === "Applications" ? (
                    <Application role={role} />
                  ) : selectedPage === "Settings" ? (
                    <Settings />
                  ) : selectedPage === "Candidates" ? (
                    <Candidates />
                  ) : selectedPage === "AssessmentBuild" ? (
                    < AssessmentBuild/>
                  ) : selectedPage === "Kanban Board" ? (
                    <KanbanBoard />
                  ) : selectedPage === "Browse Jobs" ? (
                    <BrowseJobs />
                  ) : selectedPage === "Assessment" ? (
                    <Assessment />
                  ) : selectedPage === "Setting" ? (
                    <CandidateSettings />
                  ) : selectedPage === "My Applications" ? (
                    <CandidateApplications />
                  ) : (
                    <>
                      <hr />
                      <About />
                      <hr />
                      <Gallery />
                      <Leaders />
                      {role === "admin" && <Alumni />}
                    </>
                  )}
                </>
              }
            />

            <Route
              path="/candidate/applications"
              element={<CandidateApplications />}
            />

            {/* Candidate route */}
            <Route
              path="/candidates/:id"
              element={
                <CandidateDetail
                  candidate={candidatesData[0]}
                  onClose={() => (window.location.href = "/")}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
