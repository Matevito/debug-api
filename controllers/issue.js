const createNotifications = require("../dependencies/createNotifications");

exports.issue_post = (req, res) => {
    console.log(req.file)
    res.json({
        error: null,
        msg: "todo... issue",
        data: req.file
    })
};
exports.issueList_get  = (req, res) => {
    res.json({
        error: null,
        msg: "todo..."
    })
};
exports.issue_get = (req, res) => {
    res.json({
        error: null,
        msg: "todo..."
    })
};
exports.takeIssue_put = (req, res) => {
    res.json({
        error: null,
        msg: "todo..."
    })
};
exports.issue_put = (req, res) => {
    res.json({
        error: null,
        msg: "todo..."
    })
};
exports.issue_delete = (req, res) => {
    res.json({
        error: null,
        msg: "todo..."
    })
};
