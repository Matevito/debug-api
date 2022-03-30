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

        // attempt to create issue
        res.json({
            error: null,
            msg: "todo... issue",

            data: req.files
        })
    }
];
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
