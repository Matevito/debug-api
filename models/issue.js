const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const issueSchema = mongoose.Schema({
    title: { type: String, required: true, minLength: 5, maxLength: 50 },
    description: { type: String, required: true, minLength: 5, maxLength: 500},
    project: { type: mongoose.Schema.ObjectId, ref:"Project", required: true},
    status:  { 
        type: String,
        required: true,
        enum:["open", "aditional info needed","in progress", "under review", "solved"]
    },
    priority: { 
        type: String,
        required: true,
        enum:["low", "mid", "high"]
    },
    type: {
        type: String,
        required: true,
        enum: ["bugg-error", "feature req", "documentation req"]
    },
    handlingTeam: [{
        type: mongoose.Schema.ObjectId, ref:"User"
    }],
    date: { type: Date, default: Date.now() },
    screenshots: [{
        type: String
    }] 
});

// format date

// todo: get_comments and history;

const Issue = mongoose.model("Issue", issueSchema);
module.exports = Issue;