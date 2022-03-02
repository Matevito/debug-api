const mongoose = require("mongoose");

const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    issue,
    user,
    date,
    message,
    // screenshot
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;