const Issue = require("../models/issue");
const Project = require("../models/project");

const { body, validationResult } = require("express-validator");
const createNotifications = require("../dependencies/createNotifications");

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
        if (!req.files) {
            //todo: change screenshots value
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
