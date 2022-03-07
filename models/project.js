const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
    title: { type: String, required: true, minLength: 5, maxLength: 100},
    description: { type: String, required: true, MaxLength: 500},
    teamLeader: { type: mongoose.Schema.ObjectId, ref:"User", required: true},
    team: [ { type: mongoose.Schema.ObjectId, ref:"User", required: true }],
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;