const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const issueSchema = mongoose.Schema({
    title: { type: String, required: true, minLength: 5, maxLength: 50 },
    description: { type: String, required: true, minLength: 5, maxLength: 500},
    proyect: { type: mongoose.Schema.ObjectId, ref:"Project", required: true},
    status:  { 
        type: String,
        required: true,
        enum:["open", "aditional info needed","in progress", "solved"]
    },
    priority: { 
        type: String,
        required: true,
        enum:["low", "mid", "high"]
    },
    type: {
        type: String,
        required: true,
        enum: ["Bugg-Error", "Feature req", "Documentation req", ]
    },
    date: { type: Date, default: DateTime.now() },
    screenshotNames: [{
        type: Number
    }],
    comments: {
        type: mongoose.SchemaType.ObjectId,
        ref: "Comment"
    },
    history: [{ 
        type: mongoose.SchemaType.ObjectId,
        ref: "ChangeLog",
    }]
});

// format date

const Issue = mongoose.model("Issue", issueSchema);
module.exports = Issue;