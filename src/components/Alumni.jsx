import React, { useState} from "react";
import "./Alumni.css";

function Alumni({ isAdmin }) {
  const [alumniList, setAlumniList] = useState(() => {
    const saved = localStorage.getItem("alumniList");
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    batch: "",
    company: "",
    position: "",
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedList = [...alumniList, formData];
    setAlumniList(updatedList);
    localStorage.setItem("alumniList", JSON.stringify(updatedList));

    setFormData({
      name: "",
      email: "",
      batch: "",
      company: "",
      position: "",
    });

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  return (
    <div className="alumni">
      <h2>Alumni Registration</h2>
      <p>Fill in your details below:</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="batch"
          placeholder="Graduation Batch (e.g., 2023)"
          value={formData.batch}
          onChange={handleChange}
        />
        <input
          type="text"
          name="company"
          placeholder="Current Company"
          value={formData.company}
          onChange={handleChange}
        />
        <input
          type="text"
          name="position"
          placeholder="Current Position"
          value={formData.position}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>

      {showPopup && <div className="thankyou-popup">✅ Thank you for submitting!</div>}

      {/* Show alumni details only if admin */}
      {isAdmin && alumniList.length > 0 && (
        <div className="alumni-list">
          <h3>Registered Alumni</h3>
          {alumniList.map((alum, index) => (
            <div className="alumni-card" key={index}>
              <h4>{alum.name}</h4>
              <p>{alum.email}</p>
              <p>{alum.batch}</p>
              <p>{alum.company}</p>
              <p>{alum.position}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Alumni;
