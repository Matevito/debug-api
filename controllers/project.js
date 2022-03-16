const Project = require("../models/project");
const User = require("../models/user")
const createNotifications = require("../dependencies/createNotifications");

exports.project_post = async (req, res) => {
    // 0. check if a project title is already used.
    const checkProjTitle = await Project.findOne({ title: req.body.title });
    if (checkProjTitle) {
        return res.status(400).json({
            error: "Project title is already used, try with one different",
        })
    };

    // 1. create project obj
    const new_project = new Project({
        title: req.body.title,
        description: req.body.description,
        team: req.body.team,
        teamLeader: req.body.teamLeader
    });

    // 2. handle teamLeader role status
    const teamLeader = await User.findById(req.body.teamLeader);
    if (teamLeader.role === "Developer"){
        // change it's status.
        teamLeader.role = "Team Leader";
        const id = req.body.teamLeader;

        const updated_userStatus = await User.findByIdAndUpdate(id, teamLeader);
        if (!updated_userStatus) {
            res.status(400).json({
                error: "Problem changing team leader role status"
            })
        };
        // send notification to new teamLeader
        const message = "role status changed";
        const ref = "user";
        const value = teamLeader._id;
        createNotifications([teamLeader], req.user.id , ref, value, message);
    };
    try {

        // 3. save the project 
        const savedP = await new_project.save();

        // 3.1 send notifications...
        const message = "you have been assigned to a new project";
        const ref = "project"
        const value =  savedP._id
        const author = req.user.id
        const notifications = createNotifications(req.body.team, author ,ref , value, message)

        // 4. send response
        res.json({
            error: null,
            msg: "project created",
            data: savedP,
            notifications
        })

    } catch (error) {
        res.status(400).json({ error: "Error saving data on db" })
    }
};

exports.project_get = (req, res) => {
    // returns a project in db with req.params.id
    res.json({
        msg: "todo..."
    })
};
exports.project_put = (req, res) => {
    // edits a project in db with req.params.id
    res.json({
        msg: "todo..."
    })
};

exports.project_delete = (req, res) => {
    // deletes a project in db with req.params.id
    res.json({
        msg: "todo..."
    })
};

exports.projectList_get = (req, res) => {
    res.json({
        msg: "todo..."
    })
}