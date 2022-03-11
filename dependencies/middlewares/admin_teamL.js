const User = require("../../models/user");
const Project = require("../../models/project");

const admin_teamL = async (req, res, next) => {
    const role = req.user.role;
    if (role === "Admin") {
        next();
    };
    if (role === "Team Leader") {
        const proyId = req.params.id;
        const project = await Project
        next();
    };

    return res.status(401).json({
        error: "Access denied"
    });
};

module.exports = admin_teamL;