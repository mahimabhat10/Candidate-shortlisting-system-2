const Candidate = require("../models/Candidate");
const axios = require("axios");

exports.addCandidate = async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.matchCandidates = async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;

    const candidates = await Candidate.find();

    const matched = candidates.map((candidate) => {
      const matchedSkills = candidate.skills.filter((skill) =>
        requiredSkills.includes(skill)
      );

      const score =
        (matchedSkills.length / requiredSkills.length) * 100;

      return {
        ...candidate._doc,
        matchScore: score,
        matchedSkills,
      };
    });

    matched.sort((a, b) => b.matchScore - a.matchScore);

    res.json(matched);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.aiShortlist = async (req, res) => {
  try {
    const candidates = await Candidate.find();

    const prompt = `
    Rank these candidates for React and Node.js developer role.

    Candidates:
    ${candidates
      .map(
        (c, i) =>
          `${i + 1}. ${c.name} - Skills: ${c.skills.join(", ")} - Experience: ${c.experience} years`
      )
      .join("\n")}
    `;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({ message: error.message });
  }
};