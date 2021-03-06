const Issue = require("../models/issue");
const Project = require("../models/project");
const User = require("../models/user")

const { body, validationResult } = require("express-validator");

exports.userList_get = async(req, res) => {
    let userList = await User.find({})
    if (!userList) {
        return res.status(400).json({
            error: "users on db not found"
        })
    };
    userList = userList.map((user) => {
        return {
            username: user.username,
            id: user._id,
            role: user.role,
            email: user.email
        }
    })
    res.json({
        error: null,
        msg: "user-list sent successfully",
        data: userList
    })
};
exports.user_get = async(req, res) => {
    let userOnDB =  await User.findById(req.params.id);
    if (!userOnDB) {
        return res.status(400).json({
            error: "User not found on db"
        })
    };
    userOnDB = {
        username: userOnDB.username,
        email: userOnDB.email,
        id: userOnDB._id,
        role: userOnDB.role
    }
    // user project info
    const projectsOnDB = await Project.find({});
    if (!projectsOnDB) {
        return res.status(400).json({
            error: "User data not found on db"
        })
    }
    let userProjects = projectsOnDB.filter((proj) => {
        return proj.team.includes(req.params.id)
    });
    userProjects = await Promise.all(
        userProjects.map(async(project) => {
            const projectIssues = await Issue.find({ project: project._id });
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

    // user issues info
    const issuesOnDB = await Issue.find({});
    if (!issuesOnDB) {
        return res.status(400).json({
            error: "User data not found on db"
        })
    }
    const userIssues = issuesOnDB.filter((issue) => {
        return issue.handlingTeam.includes(req.params.id)
    })

    res.json({
        error: null,
        msg: "user info sent successfully",
        data: {
            user: userOnDB,
            projects: {
                number: userProjects.length,
                list: userProjects,
            },
            issues: {
                number: userIssues.length,
                list: userIssues
            }
        }
    });
};
exports.userToAdmin_put = async(req, res) => {
    // 1.Check if user is an admin on db
    const reqUser = await User.findById(req.user.id);
    if (!reqUser) {
        return res.status(401).json({
            error: "Access denied"
        })
    };
    if (reqUser.role !== "Admin") {
        return res.status(401).json({
            error: "Access denied"
        })
    };
    // 2.attempt to make a new user an admin
    const userToEdit = await User.findById(req.params.id);
    if (!userToEdit) {
        return res.status(400).json({
            error: "error with user data on db"
        })
    };
    if (userToEdit.role === "Admin"){
        return res.status(400).json({
            error: "user is already an admin"
        })
    };

    const editedUser = new User({
        _id: userToEdit._id,
        role: "Admin",
        username: userToEdit.username,
        email: userToEdit.email,
        password: userToEdit.password
    })
    try {
        //3. attempt to save edited user on db
        const savedNewAdmin = await User.findByIdAndUpdate(userToEdit._id, editedUser);
        res.json({
            error: null,
            msg: "user bacame an admin successfully",
            data: {
                username: savedNewAdmin.username,
                _id: savedNewAdmin._id
            }
        })
    } catch (err) {
        return res.status(400).json({
            error: "error saving data on db",
        })
    }
    
}