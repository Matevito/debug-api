const api = require("../../routes/apiv1");
const express = require("express");
const Project = require("../../models/project");
const User = require("../../models/user")

if (process.env.NODE_ENV !== 'production') require("dotenv").config();

const request = require("supertest");
const testDB = require("../mongoConfigTesting");
const userList = require("../userList").get_users

//jest.useFakeTimers()

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
    return user_list
}

describe("edit_project test", () => {
    // tokens
    let adminToken;
    let devToken;
    let teamLToken;
    let otherUserToken;
    // call forms
    let adminForm;
    let projForm;
    // db info
    let usersList;
    let testProject;

    beforeAll(async() => {

        await testDB()

        //1. save users on db
        const users = await userList();
        usersList = await saveUsers(users)
        
        //2. set up admin token form
        adminForm = {
            username: users[0].username,
            password: users[0].password
        };
        adminToken = await request(app)
            .post("/log-in")
            .type("form")
            .send(adminForm)
    });

    test("route handles blank form", async() => {
        // set up admin token
        adminToken = await request(app)
            .post("/log-in")
            .type("form")
            .send(adminForm)
        adminToken = adminToken.body.token

        
        projForm = {
            title: "proj test",
            description: "a description example",
            team: [usersList[4]._id, usersList[1]._id, usersList[2]._id],
            teamLeader: usersList[4]._id
        }
        const projRes = await request(app)
            .post("/project")
            .type("form")
            .send(projForm)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": adminToken})
        testProject = projRes.body.data._id
        // test
        const res = await request(app)
            .put(`/project/${testProject}`)
            .type("form")
            .send({})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": adminToken})
        expect(res.status).toEqual(400);
        expect(res.status.msg).toEqual("Error with parsed form data")
    });
    test("protected route for users not in the team", async () => {
        const users = await userList();
        const otherUForm = {
            username: users[3].username,
            password: users[3].password
        }
        otherUserToken = await request(app)
            .post("/log-in")
            .type("form")
            .send(otherUForm)
        otherUserToken = otherUserToken.body.token

        // test
        const res  = await request(app)
            .put(`/project/${testProject}`)
            .type("form")
            .send({})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": otherUserToken})
        expect(res.status).toEqual(404);
        expect(res.error).toEqual("Protected route")
    });
    test("protected route for developers on the team", async () => {
        const users = await userList();
        const devForm = {
            username: users[1].username,
            password: users[1].password
        };
        devToken = await request(app)
            .post("/log-in")
            .type("form")
            .send(devForm)
        devToken = devToken.body.token
        //test
        const res = await request(app)
            .put(`project/${testProject}`)
            .type("form")
            .send({})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": devToken})
        expect(res.status).toEqual(404)
        expect(res.status.msg).toEqual("Protected route")
    })
    test("sucessfully edit a title and description", async () => {
        const users = await userList();
        const teamLform = {
            username: users[4].username,
            password: users[4].password
        };
        teamLToken = await request(app)
            .post("/log-in")
            .type("form")
            .send(teamLform)
        teamLToken = teamLToken.body.token
        // test
        const editProjForm = {
            title: "new proj test",
            description: "a new description",
            team: [usersList[4]._id, usersList[1]._id, usersList[2]._id],
            teamLeader: usersList[4]._id
        }
        const res = await request(app)
            .put(`project/${testProject}`)
            .type("form")
            .send(editProjForm)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": teamLToken})
        const editedProj = await Project.findById(testProject);

        expect(res.status).toEqual(202)
        expect(res.body.error).toEqual(null)
        expect(editedProj.title).toEqual("new proj test");
        expect(editedProj.description).toEqual("a new description");
        expect(editedProj.team.length).toEqual(3);
        expect(editedProj.teamLeader).toEqual(usersList[4]._id);
    });
    test("successfully edits a team, and teamL", async () => {
        // tests
        const editProjForm = {
            title: "proj test",
            description: "a description",
            team: [usersList[0]._id, usersList[1]._id],
            teamLeader: usersList[0]._id
        };
        const res = await request(app)
            .put(`project/${testProject}`)
            .type("form")
            .send(editProjForm)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": adminToken})
        const editedProj = await Project.findById(testProject);

        expect(res.status).toEqual(202)
        expect(res.body.error).toEqual(null)
        expect(editedProj.team.length).toEqual(2)
        expect(editedProj.teamLeader).toEqual(usersList[0]._id)
        expect(editedProj.title).toEqual("proj test")
    });
    test("edit test can change dev status", async () => {
        // tests
        const editProjForm = {
            title: "proj test",
            description: "a description",
            team: [usersList[2]._id, usersList[1]._id, usersList[3]._id],
            teamLeader: usersList[2]._id
        };
        const res = await request(app)
            .put(`project/${testProject}`)
            .type("form")
            .send(editProjForm)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": adminToken})
        const editedProj = await Project.findById(testProject);
        const new_TeamL = await User.findById(usersList[2]);

        expect(res.status).toEqual(202)
        expect(res.body.error).toEqual(null)
        expect(editedProj.teamLeader).toEqual(usersList[2]);
        expect(editedProj.team.length).toEqual(3);
        expect(new_TeamL.role).toEqual("Team leader");
    })
})