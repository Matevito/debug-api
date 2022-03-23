const api = require("../../routes/apiv1");
const express = require("express");
const Project = require("../../models/project");

if (process.env.NODE_ENV !== 'production') require("dotenv").config();

const request = require("supertest");
const testDB = require("../mongoConfigTesting");
const userList = require("../userList").get_users

jest.setTimeout(30000)

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", api);

const saveUsers = async(users) => {
    let user_list = [];
        users.forEach(async(user) => {
            const new_user = await user.save()
            user_list.push(new_user)
        })
    return users
}
const projectList = async(users) => {
    // user not assigned = 3
    let projects = [
        {
            title: "proj1",
            description: "an example...",
            team: [users[0]._id, users[4]._id] ,
            teamLeader: users[0]._id
        },
        {
            title: "proj2",
            description: "an example...",
            team: [users[1]._id, users[2]._id, users[4]._id] ,
            teamLeader: users[4]._id
        },
        {
            title: "proj3",
            description: "an example...",
            team: [users[2]._id, users[1]._id] ,
            teamLeader: users[2]._id
        },
    ];
    projects.forEach(async(prj) => {
        const ProjectObj = new Project(prj);
        const savedProject = await ProjectObj.save();
    })
    return projects
}
describe("GET project/list tests", () => {
    //DBinfo
    let savedUsers;
    let savedProjects

    beforeAll(async() => {
        await testDB();

        // save users on db
        const users = await userList();
        savedUsers = await saveUsers(users);

        savedProjects = await projectList(savedUsers)
    })
    // what does this controller do?
    test.todo("handles user not assigned to a project")
    test.todo("admin gets all proj on db");
    test.todo("dev gets proj where it is part of the team")
    test.todo("handles users with not assigned to projects")
})