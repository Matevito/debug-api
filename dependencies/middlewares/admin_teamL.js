const User = require("../../models/user");
const Project = require("../../models/project");

const admin_teamL = async (req, res, next) => {
    const role = req.user.role;
    const userId = req.user.id
    if (role === "Admin") {
        next();
    };
    if (role === "Team Leader") {
        const projId = req.params.id;
        const project = await Project.findById( projId );
        if (!project) {
            return res.status(400).json({
                error: "Proyect not found."
            })
        }

        // If the user is the teamleader of project :id
        if (project.teamLeader === userId) {
            next();
        }
    };

    return res.status(401).json({
        error: "Access denied"
    });
};

module.exports = admin_teamL;