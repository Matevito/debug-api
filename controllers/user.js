const Issue = require("../models/issue");
const Project = require("../models/project");
const User = require("../models/user")

exports.userList_get = async(req, res) => {
    const userList = await User.find({})
    if (!userList) {
        return res.status(400).json({
            error: "users on db not found"
        })
    };

    res.json({
        error: null,
        msg: "user-list sent successfully",
        data: userList
    })
};
exports.user_get = async(req, res) => {
    const userOnDB =  await User.findById(req.params.id);
    if (!userOnDB) {
        return res.status(400).json({
            error: "User not found on db"
        })
    };
    // user project info
    const projectsOnDB = await Project.find({});
    if (!projectsOnDB) {
        return res.status(400).json({
            error: "User data not found on db"
        })
    }
    const userProjects = projectsOnDB.filter((proj) => {
        return proj.team.includes(req.params.id);
    });
    // user issues info
    const issuesOnDB = await Issue.find({});
    if (!issuesOnDB) {
        return res.status(400).json({
            error: "User data not found on db"
        })
    }
    const userIssues = issuesOnDB.filter((issue) => {
        return issue.handlingTeam.includes(req.params.id)
    })

    res.json({
        error: null,
        msg: "user info sent successfully",
        data: {
            user: userOnDB,
            projects: {
                number: userProjects.length,
                list: projectsOnDB,
            },
            issues: {
                number: userIssues.length,
                list: userIssues
            }
        }
    });
};
exports.user_put = (req, res) => {

};