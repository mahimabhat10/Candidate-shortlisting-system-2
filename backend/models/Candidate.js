const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  name: String,
  email: String,
  skills: [String],
  experience: Number,
  bio: String,
});

module.exports = mongoose.model("Candidate", CandidateSchema);