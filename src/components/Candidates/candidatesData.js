const baseCandidates = [
  {
    id: 1,
    name: "Frank Martinez",
    email: "frank.martinez207@email.com",
    phone: "+1 (555) 751-8994",
    location: "New York, NY",
    experience: "9 years",
    skills: ["Product Management", "Analytics", "Agile"],
    stage: "Interviewing",
    statusHistory: [
      { stage: "Applied", date: "2024-04-01" },
      { stage: "Interviewing", date: "2024-04-10" },
    ],
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 99999 88888",
    location: "Bangalore, India",
    experience: "5 years",
    skills: ["React", "Node.js", "UI Design"],
    stage: "Hired",
    statusHistory: [
      { stage: "Applied", date: "2024-03-22" },
      { stage: "Interviewing", date: "2024-03-30" },
      { stage: "Hired", date: "2024-04-05" },
    ],
  },
];

// 1000 virtual candidates
const candidatesData = Array.from({ length: 1000 }, (_, i) => {
  const base = baseCandidates[i % 2];
  return {
    ...base,
    id: i + 1,
    name: `${base.name.split(" ")[0]} ${i + 1}`,
    email: `candidate${i + 1}@email.com`,
    stage: ["Applied", "Interviewing", "Hired", "Rejected"][i % 4],
  };
});

export default candidatesData;
