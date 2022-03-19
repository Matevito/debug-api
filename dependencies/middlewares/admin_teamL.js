const Project = require("../../models/project");

const admin_teamL = async (req, res, next) => {
    const role = req.user.role;
    const userId = req.user.id
    if (role === "Admin") {
        next();
    } else if (role === "Team leader") {
        const projId = req.params.id;
        const project = await Project.findById(projId);
        if (!project) {
            return res.status(400).json({
                error: "Project not found."
            })
        }
        // If the user is the teamleader of project :id
        // == insted of === pass passes a bug
        if (project.teamLeader == userId) {
            next();
        }
    } else {
        return res.status(401).json({
            error: "Access denied"
        })
    }
};

module.exports = admin_teamL;