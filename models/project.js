const mongoose = require("mongoose");

const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
    title,
    description,
    team,
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;