const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const changeLogSchema = mongoose.Schema({
    issue: { type: mongoose.Schema.ObjectId, ref: "Issue", required: true },
    property: {
        type: String,
        required: true,
        enum: ["description", "status", "priority", "type", "handlingTeam"]
    },
    oldValue: { type: String, required: true },
    newValue: { type: String, required: true },
    date: { type: Date, default: DateTime.now() }
});

// format date with the hour

const ChangeLog = mongoose.model("ChangeLog", changeLogSchema);
module.exports = ChangeLog