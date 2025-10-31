import React, { useState, useEffect, useMemo } from "react";
import "./Sidebar.css";

function Sidebar({ role, onToggleRole, onSelectPage, selectedPage }) {
  const isCandidate = role === "candidate";

   // Track active items separately for admin and candidate
  const [activeAdminIndex, setActiveAdminIndex] = useState(0);
  const [activeCandidateIndex, setActiveCandidateIndex] = useState(0);

  // Menu items
  const adminMenu = useMemo(
    () => [
      { icon: "fas fa-th-large", label: "Dashboard" },
      { icon: "fa-solid fa-briefcase", label: "Jobs" },
      { icon: "fa-regular fa-file-lines", label: "Applications" },
      { icon: "fa-regular fa-user", label: "Candidates" },
      { icon: "fa-solid fa-clipboard-list", label: "AssessmentBuild" },
      { icon: "fas fa-columns", label: "Kanban Board" },
      { icon: "fa-solid fa-gear", label: "Settings" },
    ],
    []
  );

  // For candidate
  const candidateMenu = useMemo(
    () => [
      { icon: "fa-solid fa-house", label: "Home" },
      { icon: "fa-solid fa-briefcase", label: "Browse Jobs" },
      { icon: "fa-regular fa-file-lines", label: "My Applications" },
      { icon: "fa-solid fa-clipboard-list", label: "Assessment" },
      { icon: "fa-solid fa-gear", label: "Setting" },
    ],
    []
  );

  // Select current menu & active item based on role
  const menuItems = isCandidate ? candidateMenu : adminMenu;
  const activeItem = isCandidate ? activeCandidateIndex : activeAdminIndex;

  // Handle menu click
  const handleClick = (index) => {
    const clickedItem = menuItems[index];
    if (isCandidate) setActiveCandidateIndex(index);
    else setActiveAdminIndex(index);
    if (onSelectPage) onSelectPage(clickedItem.label);
  };

  // Sync sidebar highlight with selectedPage and role
  useEffect(() => {
    const currentMenu = isCandidate ? candidateMenu : adminMenu;
    const idx = currentMenu.findIndex((m) => m.label === selectedPage);
    if (idx >= 0) {
      if (isCandidate) setActiveCandidateIndex(idx);
      else setActiveAdminIndex(idx);
    }
  }, [selectedPage, role, isCandidate, adminMenu, candidateMenu]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <li id="roleTitle">
          <i
            className={`fa-solid ${isCandidate ? "fa-user" : "fa-building"}`}
          ></i>{" "}
          <span>{isCandidate ? "Candidate" : "Admin"}</span>
        </li>

        <div className="role-toggle">
          <label className="switch">
            <input
              type="checkbox"
              checked={isCandidate}
              onChange={onToggleRole}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <hr className="sidebar-divider" />

      <ul className="sidebar-menu" id="sidebarMenu">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={activeItem === index ? "active" : ""}
            onClick={() => handleClick(index)}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
