const Project = require("../../../models/project");
const Issue = require("../../../models/issue");
const Comment = require("../../../models/comment");
const ChangeLog = require("../../../models/changeLog");


const getProject = async(users) => {
    const newProject = new Project({
        title: "second project",
        description: "an example of a test",
        team: [users[3]._id, users[0]._id, users[4]._id],
        teamLeader: [users[0]._id]
    });
    const savedProject = await newProject.save();
    return savedProject
}
const getIssues = async(project) => {
    const projectId = project._id
    const issuesForm = [
        {
            title: "issue 4",
            description: "an example of a description",
            project: projectId,
            status: "open",
            priority: "mid",
            type: "feature req",
            screenshots: []
        },
        {
            title: "issue 5",
            description: "a description....",
            project: projectId,
            status: "open",
            priority: "high",
            type: "bugg-error",
            screenshots: []
        },
        {
            title: "issue 6",
            description: "a new value",
            project: projectId,
            status: "in progress",
            priority: "high",
            type: "feature req",
            handlingTeam: [project.team[1], project.team[0]],
            screenshots: []
        }
    ];

    const issuesObj = []
    issuesForm.forEach(async (form) => {
        const new_issue = new Issue(form);
        new_issue.save();
        issuesObj.push(new_issue)
        //await new_issue.save()
    })
    return issuesObj
}

const getCommentsLog = async(issue, users) => {
    const issueId = issue._id;
    // form data
    const commentList = [
        {
            issue: issueId,
            user: users[0]._id,
            message: "first comment",
            screenshots: []
        },
        {
            issue: issueId,
            user: users[1]._id,
            message: "second comment",
            screenshots: []
        }
    ];
    // save data
    const changeLog_obj = new ChangeLog({
        issue: issueId,
        property: "description",
        oldValue: "........",
        newValue: "a new value",
        user: users[0]._id
    });
    await changeLog_obj.save();

    
    const commentsObjs = [];
    commentList.forEach(async(form) => {
        const new_comment = new Comment(form);
        commentsObjs.push(new_comment);
        new_comment.save()
    });
    // send response
    return {
        comments: commentsObjs,
        changeLog: changeLog_obj
    }
};

exports.getData = async(users) => {
    const project = await getProject(users);
    const issuesList = await getIssues(project);
    const comments_cLog = await getCommentsLog(issuesList[2], users);
    return {
        project,
        issues: issuesList,
        comments : comments_cLog.comments,
        changeLog: comments_cLog.changeLog
    }
}