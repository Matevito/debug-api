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
        enum: ["Bugg-Error", "Feature req", "Documentation req"]
    },
    handlingTeam: [{
        type: mongoose.Schema.ObjectId, ref:"Project"
    }],
    date: { type: Date, default: DateTime.now() },
    screenshots: [{
        type: String
    }] 
});

// format date

// todo: get_comments and history;

const Issue = mongoose.model("Issue", issueSchema);
module.exports = Issue;