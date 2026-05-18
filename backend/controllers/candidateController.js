const Candidate = require("../models/Candidate");

exports.addCandidate = async (req, res) => {
  try {

    const candidate = new Candidate(req.body);

    await candidate.save();

    res.status(201).json(candidate);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


exports.getCandidates = async (req, res) => {
  try {

    const candidates = await Candidate.find();

    res.json(candidates);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


exports.matchCandidates = async (req, res) => {
  try {

    const { requiredSkills } = req.body;

    const candidates = await Candidate.find();

    const matched = candidates.map((candidate) => {

      const matchedSkills =
        candidate.skills.filter((skill) =>
          requiredSkills.includes(skill)
        );

      const score =
        (matchedSkills.length / requiredSkills.length) * 100;

      return {
        ...candidate._doc,
        matchScore: Math.round(score),
        matchedSkills,
      };

    });

    matched.sort(
      (a, b) => b.matchScore - a.matchScore
    );

    res.json(matched);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


exports.aiShortlist = async (req, res) => {
  try {

    res.json({
      choices: [
        {
          message: {
            content:
              "Rahul Sharma is the best candidate because he has strong React and Node.js skills with relevant experience. Aman Verma is also suitable because of React and MongoDB knowledge."
          }
        }
      ]
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};