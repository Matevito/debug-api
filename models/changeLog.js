const mongoose = require("mongoose");

const changeLogSchema = mongoose.Schema({
    ///todo:::....
});

const ChangeLog = mongoose.model("ChangeLog", changeLogSchema);
module.exports = ChangeLog