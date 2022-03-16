const Project = require("../models/project");
const User = require("../models/user")

exports.project_post = async (req, res) => {
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
    };

    try {
        // 3. save the project 
        const savedP = await new_project.save();
        
        // 3.1 send notifications...
        // 4. send response
        res.json({
            error: null,
            msg: "project created",
            data: new_project
        })

    } catch (error) {
        res.status(400).json({ error })
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