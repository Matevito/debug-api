const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const commentSchema = mongoose.Schema({
    issue: { type: mongoose.Schema.ObjectId, ref:"Issue", required: true},
    user: { type: mongoose.Schema.ObjectId, ref:"User", required: true},
    date: { type: Date, default: DateTime.now() },
    message: { type: String, required:true, minLength: 1, maxLength: 500 },
    // screenshot
});

//todo: return date formatted.

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;