import React from "react";
import "./Leaders.css";

function Leaders() {
  const leaders = [
    { img: "/rohan.jpg", name: "Rohan Khanna", role: "Chief Executive Officer (CEO)" },
    { img: "/priya.jpg", name: "Priya Mehta", role: "Chief Technology Officer (CTO)" },
    { img: "/aman.jpg", name: "Aman Verma", role: "Head of Human Resources (HR Head)" },
    { img: "/priya.jpg", name: "Neha Sharma", role: "Chief Marketing Officer (CMO)" },
  ];

  return (
    <div className="enlighten">
      <h3 className="us">Let us enlighten you</h3>
      <h4 className="at">Leaders at TalentFlow</h4>
      <div id="speaker">
        {leaders.map((leader, index) => (
          <div className="card" key={index}>
            <img src={leader.img} alt={leader.name} />
            <h3>{leader.name}</h3>
            <p>{leader.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaders;
