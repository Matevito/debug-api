const Project = require("../models/project");

exports.project_post = async (req, res) => {
    // 1. create project obj
    const new_project = new Project({
        title: req.body.title,
        description: req.body.description,
        team: req.body.team,
        teamLeader: req.body.teamLeader
    });
    // 2. handle teamLeader role status
    try {
        // 3. save the project and send notifications
        const savedP = await new_project.save();
        
        // 4. send response
        res.json({
            error: null,
            msg: "project created",
            data: new_project
        })

    } catch (err) {
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