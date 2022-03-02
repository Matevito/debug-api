const mongoose = require("mongoose");

const mongoose = require("mongoose");

const issueSchema = mongoose.Schema({
    title,
    description,
    proyect,
    status,
    priority,
    type,
    date,
    screenshots,
    // comments and history?
});

const Issue = mongoose.model("Issue", issueSchema);
module.exports = Issue;