const User = require("../../models/user");
const Proyect = require("../../models/project");
const Issue = require("../../models/issue");

const inProyect = (req, res, next) => {
    //todo...
    const user = req.user;
    if (user.role === "Admin"){
        next();
    }

    // check if user is in proyect team... or if is an admin
    return res.status(401).json({
        error: "Access denied"
    })
};

module.exports = inProyect;