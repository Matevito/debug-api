const Issue = require("../../models/issue");

const setIssueValues = async(req, res, next) => {
    const issueId = req.params.id;
    
    const issueInDb = await Issue.findById(issueId);
    if (!issueInDb) {
        res.json({
            error: "Project of issue not found"
        })
    };
    req.params.id = issueInDb.project;
    req.issue = issueId;
    next();
};

module.exports = setIssueValues;