const Issue = require("../models/issue");
const Project = require("../models/project");

const { body, validationResult } = require("express-validator");
const createNotifications = require("../dependencies/createNotifications");
const createChangeLog = require("../dependencies/createChangeLog");

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
    
        let screenshots = [];
        if (req.files) {
            //todo: change screenshots value
            const files = req.files
            files.forEach((file) => {
                const path = file.path
                screenshots.push(path)
            })
        }

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
exports.issue_get = (req, res) => {
    // send changelog
    res.json({
        error: null,
        msg: "todo..."
    })
};
exports.takeIssue_put = async (req, res) => {
    const currentIssue = await Issue.findById(req.issue);
    if (!currentIssue) {
        res.json({
            error: "error fetching issue data"
        })
    }
    let currentTeam = currentIssue.handlingTeam;
    const userId = req.user.id;

    // check if user is part of the team
    if (currentTeam.includes(userId)){
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
    try {
        const savedIssue = await Issue.findByIdAndUpdate(currentIssue._id, editedIssueObj)
        res.json({
            error: null,
            msg: "User added to handlingTeam successfully",
        })
    } catch (err) {
        res.status(400).json({
            error: "error saving data on db"
        })
    }
};

exports.leaveIssue_put = (req, res) => {
    res.json({
        error: null,
        msg: "todo leave-issue"
    })
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
            const changeLog = await createChangeLog(issueOnDB, editedIssueObj);
            
            /*condifition. if this happens then the issue was truly changed,
            so send notification. if not, then theres no need to send notifications.*/
            if (changeLog === true ) {
                // set-up notifications
                const message = `the issue "${issueOnDB.title}" has been edited`
                const ref = "issue";
                const value = issueOnDB._id;
                const author = req.user.id
                const team = issueOnDB.handlingTeam;
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
exports.issue_delete = (req, res) => {
    res.json({
        error: null,
        msg: "todo..."
    })
};
