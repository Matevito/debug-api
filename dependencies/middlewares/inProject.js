const User = require("../../models/user");
const Project = require("../../models/project");
const inProject = async(req, res, next) => {
    //todo...
    const user = req.user;
    if (user.role === "Admin"){
        return next();
    }
    try {
        const project = await Project.findById(req.params.id);
        
        // check if user is in the project team
        let pTeam = project.team;
    
        const foundUser = pTeam.find(id => id == user.id);
        if (!foundUser) {
            return res.status(401).json({
                error: "Access denied"
            })
        }
        return next();
    } catch(err) {
        return res.status(400).json({
            error: "Project not found"
        })
    }
};

module.exports = inProject;