const Project = require("../models/project");
const Issue = require("../models/issue");
const User = require("../models/user");
const Comment = require("../models/comment");
const ChangeLog = require("../models/changeLog");

const createNotifications = require("../dependencies/createNotifications");
const get_projectData = require("../dependencies/get_projectData");

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
        teamLeader.role = "Team leader";
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
exports.project_put = async (req, res) => {
    // edits a project in db with req.params.id
    const projectID = req.params.id;

    // check if the project exist
    const checkProj = await Project.findById(projectID);
    if (!checkProj) {
        return res.status(400).json({
            error: "Project not found"
        })
    };

    const edited_project = new Project({
        _id: checkProj._id,
        title: req.body.title,
        description: req.body.description,
        team: req.body.team,
        teamLeader: req.body.teamLeader
    });

    // handle teamLeader role status;
    const teamLeader = await User.findById(req.body.teamLeader);
    if (teamLeader.role === "Developer"){
        teamLeader.role = "Team leader";
        const leaderId = req.body.teamLeader;
        const updated_userStatus = await User.findByIdAndUpdate(leaderId, teamLeader);
        if (!updated_userStatus) {
            res.status(400).json({
                error:" Problem changing team leader role status"
            })
        };
        // send notifications of this change
        const message = "role status changed";
        const ref = "user";
        const value = teamLeader._id;
        createNotifications([teamLeader], req.user.id, ref, value, message);
    };

    // save edited project
    try {
        
        const editedP = await Project.findByIdAndUpdate(checkProj._id, edited_project);
        // send notifications
        const message = "Changes have been made on the project";
        const ref = "project";
        const value = editedP._id;
        const author = req.user.id;
        //todo: remove the author to the list of users to send notifications
        const notifications = createNotifications(req.body.team, author, ref, value, message);

        // send response
        res.json({
            error: null,
            msg: "project successfully edited",
            data: editedP,
            notifications,
        })
    } catch(error) {
        res.status(400).json({ error: "Error saving data on db" })
    }
};
exports.project_delete = async (req, res) => {
    // deletes a project in db with req.params.id
    const projId = req.params.id;

    const proj = await Project.findById(projId);
    if (!proj) {
        return res.status(400).json({
            error: "Project not found"
        })
    };
    // atttemp to delete proj
    const projectData = await get_projectData(proj._id);
    try {
        await Project.findByIdAndRemove(proj._id);

        //delte project related data
        projectData.issues.forEach(async(issue) => {
            await Issue.findByIdAndRemove(issue._id)
        })
        projectData.comments.forEach(async(comment) => {
            await Comment.findByIdAndRemove(comment._id)
        })
        projectData.changeLogs.forEach(async(log) => {
            await ChangeLog.findByIdAndRemove(log._id)
        })

        //send response
        res.json({
            error: null,
            message: "project deleted!"
        })
    } catch (error) {
        res.status(400).json({ error })
    }
};
exports.project_get = async (req, res) => {
    // returns a project in db with req.params.id}
    const project = await Project.findById(req.params.id).populate({path: "teamLeader team", select:"username"})
    if (!project) {
        return res.status(400).json({
            error: "Project not found"
        })
    };

    // todo: check paring data of issues
    let projIssues = await Issue.find({ project: req.params.id }).populate({path: "handlingTeam", select:"username"})
    if (!projIssues) {
        return res.status(400).json({
            error: "Error parsing project data"
        })
    };
    
    //send response
    res.json({
        error: null,
        msg: "Project succesfully send",
        data: project,
        issues: projIssues
    })
};
exports.projectList_get = async (req, res) => {
    let projectList = await Project.find({});
    if (!projectList) {
        return res.status(400).json({
            error: "Data not found"
        })
    };

    // exception for admins
    if (req.user.role !== "Admin"){
        // only projects where user is part of the team 
        projectList = projectList.filter((projObj) => {
            return projObj.team.includes(req.user.id)
        })
    };
    // get isssues data of the projects;
    const projectsData = await Promise.all(
        projectList.map(async(project) => {
            const projectIssues = await Issue.find({project: project._id});
            
            let response = {
                _id: project._id,
                title: project.title,
                description: project.description,
                team: project.team,
                teamLeader: project.teamLeader
            }
            response.issues = projectIssues.length,
            response.solvedIssues = projectIssues.filter(proj => proj.status === "solved").length
            
            return response
        })
    )
    
    res.json({
        error: null,
        msg: "Successfully send project data",
        data: projectsData
    })
}