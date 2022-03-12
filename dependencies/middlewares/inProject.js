const User = require("../../models/user");
const Project = require("../../models/project");
const Issue = require("../../models/issue");

const inProject = async (req, res, next) => {
    //todo...
    const user = req.user;
    if (user.role === "Admin"){
        next();
    }
    // check if the issue and it's proyect exist on database
    const issueId = req.params.id;
    const issue = await Issue.findById(issueId);
    if (!issue) {
        return res.status(400).json({
            error: `Issue not found`
        })
    };
    const project = await Project.findById(issue.project);
    if (!project) {
        return res.status(400).json({
            error: "Issue does not have assigned a valid proyect"
        })
    }
    
    // check if user is in the project team
    let pTeam = project.team;
    pTeam = pTeam.concat(project.teamLeader);

    const foundUser = pTeam.find(id => id === user.id);
    if (!foundUser) {
        return res.status(401).json({
            error: "Access denied"
        })
    };

    // user is in the team, continue.
    next();
};

module.exports = inproject;