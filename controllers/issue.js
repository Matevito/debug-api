const Issue = require("../models/issue");
const Project = require("../models/project");
const ChangeLog = require("../models/changeLog");
const Comment = require("../models/comment")

const { body, validationResult } = require("express-validator");
const createNotifications = require("../dependencies/createNotifications");
const createChangeLog = require("../dependencies/createChangeLog");
const saveImages = require("../dependencies/saveImages");

exports.issue_post = [
    body("title", "A title for the project is required").trim().isLength({ min:5, max:100}).escape(),
    body("description", "A description is required").trim().isLength({ min:5, max:500}).escape(),
    body("project").custom(async(value, {req}) => {

        const projectExist = await Project.findById(value);
        if (!projectExist) {
            throw new Error("Project id is corrupted")
        }
        return true;
    }).escape(),
    body("priority").custom((value) => {
        const validFormat = ["low", "mid", "high"];
        if (!validFormat.includes(value)) {
            throw new Error("priority value is corrupted")
        }
        return true;
    }).escape(),
    body("type").custom((value) => {
        const validFormat = ["bugg-error", "feature req", "documentation req"];
        if (!validFormat.includes(value)) {
            throw new Error("type value is corrupted")
        }
        return true;
    }).escape(),
    async (req, res) => {
        
        // validate data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                msg: "error with parsed form data",
                error: errors.array()
            })
        }

        // 1. attempt to create issue Obj
    
        // handle screenshots
        const files = req.files;
        const screenshots = await saveImages(files)
        
        const new_issue = new Issue({
            title: req.body.title,
            description: req.body.description,
            project: req.body.project,
            status: "open",
            priority: req.body.priority,
            type: req.body.type,
            screenshots: screenshots,
        });
        // 2. send notifications to team members and save issue
        const userId = req.user.id
        let team = await Project.findById(req.body.project);
        team = team.team.filter(teamMember => { return teamMember != userId });

        try {
            const savedIssue = await new_issue.save();

            const message = "a new issue has been created";
            const ref = "project";
            const value = savedIssue._id
            const author = userId;
            const notifications = createNotifications(team, author, ref, value, message);
            
            res.json({
                error: null,
                msg: "Issue created",
                data: savedIssue,
                notifications
            })
        } catch(err) {
            res.status(400).json({ error: "Error saving data on db"})
        }
    }
];
exports.issueList_get  = async (req, res) => {
    const projId = req.params.id
    const IssueList = await Issue.find({ project: projId })
    if (!IssueList) {
        res.status(400).json({
            error: "Data not found"
        })
    };
    res.json({
        error: null,
        msg: "send Issue list",
        data: IssueList
    })
};
exports.issue_get = async(req, res) => {
    // this is done too on the middleware that sets proj id and issue id values on req
    const issue = await Issue.findById(req.issue).populate({path:"handlingTeam", select:"username"});
    if (!issue) {
        return res.status(400).json({
            error: "Issue not found on db"
        })
    }

    // get changelog and comments of issue
    const issueChangeLog = await ChangeLog.find({ issue: issue._id}).populate({path: "user", select:"username"});
    if (!issueChangeLog) {
        return res.status(400).json({
            error: "Changelog of issue not found"
        })
    };

    const issueComments = await Comment.find({ issue: issue._id}).populate({path:"user", select:"username"});
    if (!issueComments) {
        return res.status(400).json({
            error: "Comments of issue not found on db"
        })
    };

    // form data obj and attemp to send res
    const data  = {
        issue,
        changeLog: issueChangeLog,
        comments: issueComments
    }
    res.json({
        error: null,
        msg: "Issue sent successfully!",
        data
    })
};
exports.takeIssue_put = async (req, res) => {
    const currentIssue = await Issue.findById(req.issue);
    if (!currentIssue) {
        res.json({
            error: "error fetching issue data"
        })
    }
    // copy array
    let currentTeam = currentIssue.handlingTeam.filter(() => true);
    const userId = req.user.id;
    // check if user is part of the team
    if (currentIssue.handlingTeam.includes(userId)){
        return res.status(400).json({
            error: "User already part of the team"
        })
    }

    // build new issue obj
    currentTeam.push(userId);
    const editedIssueObj = new Issue({
        _id: currentIssue._id,
        title: currentIssue.title,
        description: currentIssue.description,
        project: currentIssue.project,
        status: currentIssue.status,
        priority: currentIssue.priority,
        type: currentIssue.type,
        date: currentIssue.date,
        screenshots: currentIssue.screenshots,
        handlingTeam: currentTeam,
    })
    // attempt to save changed issue
    const IssueProject = await Project.findById(req.params.id);
    if (!IssueProject) {
        res.status(400).json({
            error: "error fetching data on db"
        })
    };
    try {
        const savedIssue = await Issue.findByIdAndUpdate(currentIssue._id, editedIssueObj)
        
        // create notifications and changelog
        let notifications = false;
        const changeLog = await createChangeLog(currentIssue, editedIssueObj, userId);
        if (changeLog === true) {
            const message = `the issue ${currentIssue.title} team has been edited`;
            const ref = "issue";
            const value = currentIssue._id;
            const author = req.user.id;
            let team = currentIssue.handlingTeam;
            const teamLeader = IssueProject.teamLeader;
            if (!team.includes(teamLeader)){
                team.push(teamLeader)
            };
            notifications = createNotifications(team, author, ref, value, message)
        };

        res.json({
            error: null,
            msg: "User added to handlingTeam successfully",
            notifications,
            changeLog
        })
    } catch (err) {
        res.status(400).json({
            error: "error saving data on db"
        })
    }
};
exports.leaveIssue_put = async (req, res) => {
    const currentIssue = await Issue.findById(req.issue);
    if (!currentIssue) {
        res.json({
            error: "error fetching issue data"
        })
    };
    const userId = req.user.id;
    // check if user is part of the team
    if (!currentIssue.handlingTeam.includes(userId)){
        return res.status(400).json({
            error: "User is not part of the issue-team"
        })
    }

    //create new issue with edited team
    const currentTeam = currentIssue.handlingTeam.filter(() => true);
    const newTeam = currentTeam.filter((id) => id != userId);

    const editedIssueObj = new Issue({
        _id: currentIssue._id,
        title: currentIssue.title,
        description: currentIssue.description,
        project: currentIssue.project,
        status: currentIssue.status,
        priority: currentIssue.priority,
        type: currentIssue.type,
        date: currentIssue.date,
        screenshots: currentIssue.screenshots,
        handlingTeam: newTeam,
    })

    // attempt to save edited issue
    const IssueProject = await Project.findById(req.params.id);
    if (!IssueProject) {
        res.status(400).json({
            error: "error fetching data on db"
        })
    };
    try {
        await Issue.findByIdAndUpdate(currentIssue._id, editedIssueObj)

        let notifications = false;
        const changeLog = createChangeLog(currentIssue, editedIssueObj, userId);
        if (changeLog === true) {
            const message = `the issue ${currentIssue.title} team has been edited`;
            const ref = "issue";
            const value = currentIssue._id;
            const author = req.user.id;
            let team = editedIssueObj.handlingTeam;
            const teamLeader = IssueProject.teamLeader;
            if (!team.includes(teamLeader)){
                team.push(teamLeader);
            };
            notifications = createNotifications(team, author, ref, value, message)
        }
        // create notifications and changeLog
        res.json({
            error: null,
            msg: "User successfully removed from issue-team",
            notifications,
            changeLog
        })

    } catch(err) {
        res.status(400).json({
            error: "error saving data on db"
        })
    }
    
} 
exports.issue_put = [
    body("description", "A description is required").trim().isLength({ min:5, max:500}).escape(),
    body("status").custom((value, { req }) => {
        const validFormat = ["open", "aditional info needed","in progress", "under review", "solved"]
        if (!validFormat.includes(value)) {
            throw new Error("status value is corrupted")
        }
        const userRole = req.user.role;
        if (userRole === "Developer" && value === "solved") {
            throw new Error("developer does not have auth to change this value")
        }

        return true
    }).escape(),
    body("priority").custom((value) => {
        const validFormat = ["low", "mid", "high"];
        if (!validFormat.includes(value)){
            throw new Error("priority value is corrupted")
        }
        return true
    }).escape(),
    body("type").custom((value) => {
        const validFormat = ["bugg-error", "feature req", "documentation req"];
        if (!validFormat.includes(value)) {
            throw new Error("type value is corrupted")
        }
        return true;
    }).escape(),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                msg: "error with parsed form data",
                error: errors.array()
            })
        };

        // attemp to edit issue ticket
            // proj = req.params.id
            // issue = req.issue
        const projectId = req.params.id;
        const projectObj = await Project.findById(projectId);
        const issueId = req.issue;
        const issueOnDB = await Issue.findById(issueId);
        const editedIssueObj = new Issue({
            _id: issueOnDB._id,
            title: issueOnDB.title,
            description: req.body.description,
            project: issueOnDB.project,
            status: req.body.status,
            priority: req.body.priority,
            type: req.body.type,
            handlingTeam: issueOnDB.handlingTeam,
            date: issueOnDB.date,
            screenshots: issueOnDB.screenshots
        });

        try {
            await Issue.findByIdAndUpdate(issueOnDB._id, editedIssueObj);
            
            // set-up changelog
            let notifications = false
            const changeLog = await createChangeLog(issueOnDB, editedIssueObj, req.user.id);
            
            /*condifition. if this happens then the issue was truly changed,
            so send notification. if not, then theres no need to send notifications.*/
            if (changeLog === true ) {
                // set-up notifications
                const message = `the issue "${issueOnDB.title}" has been edited`
                const ref = "issue";
                const value = issueOnDB._id;
                const author = req.user.id
                let team = issueOnDB.handlingTeam;
                const teamLeader = projectObj.teamLeader;
                if (!team.includes(teamLeader)){
                    team.push(teamLeader)
                };
                notifications = createNotifications(team, author, ref, value, message)
            };

            res.status(200).json({
                error: null,
                msg: "issue successfully edited!",
                notifications,
                changeLog
            })
        } catch(err) {
            res.status(400).json({error: "Error saving data on db"})
        }
    }
]
exports.issue_delete = async (req, res) => {
    // 1. get data to delete
    const issue = await Issue.findById(req.issue);
    
    if (!issue) {
        return res.status(400).json({
            error: "Issue not found on db"
        })
    }
    const issueComments = await Comment.find({issue: req.issue});
    if (!issueComments) {
        return res.status(400).json({
            error: "Issue comments not found on db"
        })
    }
    const issueChangeLog = await ChangeLog.find({issue: req.issue});
    if (!issueChangeLog) {
        return res.status(400).json({
            error: "Issue change-log not found on db"
        })
    }
    // 2. delete and send response
    try {
        // atempt to delete issue and related data to it
        await Issue.findByIdAndRemove(issue._id);
        issueComments.forEach(async(comment) => {
            await Comment.findByIdAndRemove(comment._id);
        })
        issueChangeLog.forEach(async(log) => {
            await ChangeLog.findByIdAndRemove(log._id);
        });
        res.json({
            error: null,
            msg: "Issue deleted successfully",
        })
    } catch (err){ 
        res.status(400).json({
            error: "error deleting data on db"
        })
    }
};
