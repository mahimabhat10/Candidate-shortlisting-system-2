const express = require("express");

const {
  addCandidate,
  getCandidates,
  matchCandidates,
  aiShortlist,
} = require("../controllers/candidateController");

const router = express.Router();

router.post("/candidates", addCandidate);

router.get("/candidates", getCandidates);

router.post("/match", matchCandidates);

router.post("/ai/shortlist", aiShortlist);

module.exports = router;