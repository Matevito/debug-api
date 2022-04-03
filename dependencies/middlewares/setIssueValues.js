const Issue = require("../../models/issue");

const setIssueValues = async(req, res, next) => {
    const issueId = req.params.id;
    
    const issueInDb = await Issue.findById(issueId);
    if (!issueInDb) {
        return res.status(400).json({
            error: "Issue not found on db"
        })
    };
    req.params.id = issueInDb.project;
    req.issue = issueId;
    next();
};

module.exports = setIssueValues;