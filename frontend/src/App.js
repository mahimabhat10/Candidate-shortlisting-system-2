import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: "",
    experience: "",
    bio: "",
  });

  const [candidates, setCandidates] = useState([]);

  const [requiredSkills, setRequiredSkills] =
    useState("");

  const [matched, setMatched] = useState([]);

  const [aiResult, setAiResult] =
    useState("");


  const API =
    "https://candidate-backend-l7mz.onrender.com/api";


  const fetchCandidates = async () => {

    try {

      const res =
        await axios.get(`${API}/candidates`);

      setCandidates(res.data);

    } catch (error) {

      console.log(error);

    }
  };


  useEffect(() => {

    fetchCandidates();

  }, []);


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  const addCandidate = async (e) => {

    e.preventDefault();

    try {

      await axios.post(`${API}/candidates`, {
        ...formData,
        skills: formData.skills
          .split(",")
          .map(skill => skill.trim()),
      });

      alert("Candidate Added Successfully");

      setFormData({
        name: "",
        email: "",
        skills: "",
        experience: "",
        bio: "",
      });

      fetchCandidates();

    } catch (error) {

      console.log(error);

      alert("Error Adding Candidate");

    }
  };


  const matchCandidates = async () => {

    try {

      const res = await axios.post(
        `${API}/match`,
        {
          requiredSkills:
            requiredSkills
              .split(",")
              .map(skill => skill.trim()),
        }
      );

      console.log(res.data);

      setMatched(res.data);

    } catch (error) {

      console.log(error);

      alert("Error Matching Candidates");

    }
  };


  const getAIShortlist = async () => {

    try {

      const res =
        await axios.post(
          `${API}/ai/shortlist`
        );

      const content =
        res.data.choices[0].message.content;

      setAiResult(content);

    } catch (error) {

      console.log(error);

      alert("Error Fetching AI Result");

    }
  };


  return (

    <div className="container">

      <h1>Candidate Shortlisting System</h1>


      <div className="form-card">

        <h2>Add Candidate</h2>

        <form onSubmit={addCandidate}>

          <input
            type="text"
            name="name"
            placeholder="Candidate Name"
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
            name="skills"
            placeholder="Skills (React, Node.js)"
            value={formData.skills}
            onChange={handleChange}
            required
          />


          <input
            type="number"
            name="experience"
            placeholder="Experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />


          <textarea
            name="bio"
            placeholder="Short Bio"
            value={formData.bio}
            onChange={handleChange}
          />


          <button type="submit">
            Add Candidate
          </button>

        </form>

      </div>


      <div className="match-box">

        <h2>Find Best Candidates</h2>


        <input
          type="text"
          placeholder="Required Skills"
          value={requiredSkills}
          onChange={(e) =>
            setRequiredSkills(e.target.value)
          }
        />


        <button onClick={matchCandidates}>
          Match Candidates
        </button>


        <button onClick={getAIShortlist}>
          AI Shortlist
        </button>

      </div>


      <h2 className="section-title">
        All Candidates
      </h2>


      <div className="grid">

        {candidates.map((c) => (

          <div
            className="card"
            key={c._id}
          >

            <h3>{c.name}</h3>


            <p>
              <strong>Email:</strong>
              {" "}
              {c.email}
            </p>


            <p>
              <strong>Skills:</strong>
              {" "}
              {c.skills.join(", ")}
            </p>


            <p>
              <strong>Experience:</strong>
              {" "}
              {c.experience}
            </p>


            <p>
              <strong>Bio:</strong>
              {" "}
              {c.bio}
            </p>

          </div>

        ))}

      </div>


      <h2 className="section-title">
        Matched Candidates
      </h2>


      <div className="grid">

        {matched.length > 0 ? (

          matched.map((m) => (

            <div
              className="card matched-card"
              key={m._id}
            >

              <h3>{m.name}</h3>


              <p>
                <strong>Match Score:</strong>
                {" "}
                {m.matchScore}%
              </p>


              <p>
                <strong>Matched Skills:</strong>
                {" "}
                {m.matchedSkills.join(", ")}
              </p>

            </div>

          ))

        ) : (

          <p>
            No matched candidates yet.
          </p>

        )}

      </div>


      <h2 className="section-title">
        AI Recommendation
      </h2>


      <div className="card">

        <p
          style={{
            whiteSpace: "pre-line"
          }}
        >
          {aiResult}
        </p>

      </div>

    </div>
  );
}

export default App;