const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const commentSchema = mongoose.Schema({
    issue: { type: mongoose.Schema.ObjectId, ref:"Issue", required: true},
    user: { type: mongoose.Schema.ObjectId, ref:"User", required: true},
    date: { type: Date, default: Date.now },
    message: { type: String, required:true, minLength: 1, maxLength: 500 },
    screenshots: [{ type: String }],
});

//todo: return date formatted.

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;