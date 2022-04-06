const Issue = require("../models/issue");
const Comment = require("../models/comment");
const ChangeLog = require("../models/changeLog");

const get_projectData = async(projId) => {
    const projIssues = await Issue.find({ project: projId });
    
    // get comments and logs
    const issuesIDlist = projIssues.map((issue) => {
        return String(issue._id)
    })
    const commentsDb = await Comment.find({});
    const commentsProject = commentsDb.filter((comment) => {
        const comment_issue = String(comment.issue);
        if (issuesIDlist.includes(comment_issue)){
            return true
        } else {
            return false
        }
    })
    const changeLogsDb = await ChangeLog.find({});
    const logsProject = changeLogsDb.filter((log) => {
        const log_issue = String(log.issue);
        if (issuesIDlist.includes(log_issue)) {
            return true
        } else {
            return false
        }
    })
    const response = {
        issues: projIssues,
        comments: commentsProject,
        changeLogs: logsProject
    }; 
    return response
};

module.exports = get_projectData;