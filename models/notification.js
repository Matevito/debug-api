const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const notificationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    message: { type: String, required: true },
    ref: { type:String, required: true },
    value: { type: mongoose.Schema.ObjectId, required: true },
    date: { type: Date, default: Date.now() },
});

const  Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;