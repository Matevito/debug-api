const Project = require("../models/project");

const sanitizeProject = require("../dependencies/middlewares/sanitizeProject");

exports.project_post = (req, res) => {
    // todo... component structure
    const new_project = new Project({
        title: req.body.title,
        description: req.body.description,
        team: req.body.team,
        teamLeader: req.body.teamLeader
    });

    res.json({
        msg: "data is fine",
        data: new_project
    })
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