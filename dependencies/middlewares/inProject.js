const User = require("../../models/user");
const Project = require("../../models/project");
const Issue = require("../../models/issue");

const inProject = (req, res, next) => {
    //todo...
    const user = req.user;
    if (user.role === "Admin"){
        next();
    }

    // check if user is in project team... or if is an admin
    return res.status(401).json({
        error: "Access denied"
    })
};

module.exports = inproject;