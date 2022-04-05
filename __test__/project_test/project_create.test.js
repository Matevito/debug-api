const api = require("../../routes/apiv1");
const express = require("express");
const User = require("../../models/user")

if (process.env.NODE_ENV !== 'production') require("dotenv").config();

const request = require("supertest");
const testDB = require("../mongoConfigTesting");
const userList = require("../userList").get_users

//jest.useFakeTimers()
jest.setTimeout(30000)

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", api);

describe("create_project tests", () => {
    let token;
    let form;
    let usersList;
    beforeAll(async() => {
        await testDB()
        
        // 1. save users on db
        const users = await userList();
        let user_list = []
        users.forEach(async(user) => {
            const new_user = await user.save()
            user_list.push(new_user)
        });

        // todo: set up users on db
        usersList = user_list;
        // 2. get token for authentication
        form = {
            username: users[0].username,
            password: users[0].password
        }
        token = await request(app)
            .post("/log-in")
            .type("form")
            .send(form)
    })
    test("handles a blank form", async () => {
        // get admin token
        token = await request(app)
            .post("/log-in")
            .type("form")
            .send(form)
        token = token.body.token
        
        // test
        const res = await request(app)
            .post("/project")
            .type("form")
            .send({})
            .set({ "auth-token": token })
        expect(res.body.error).toBeDefined()
        expect(res.body.msg).toEqual("Error with parsed form data")
        expect(res.body.error.length).toEqual(3)
    });
    test("teamLeader is not on team", async() => {
        const proj_form = {
            title: "proyect test",
            description: "a description example",
            team: [usersList[1]._id, usersList[2]._id],
            teamLeader: usersList[0]._id
        };
        //test
        const res = await request(app)
            .post("/project")
            .type("form")
            .send(proj_form)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})
        const error = res.body.error || null
        expect(error.length).toEqual(1)
        expect(error[0].msg).toEqual("team leader is not in the team list")
    });
    test("team has duplicated users", async() => {
        const proj_form = {
            title: "proyect test",
            description: "a description example",
            team: [usersList[1]._id, usersList[2]._id, usersList[2]._id],
            teamLeader: usersList[2]._id
        };
        const res = await request(app)
            .post("/project")
            .type("form")
            .send(proj_form)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})
        const error = res.body.error || null
        expect(error).not.toBe(null)
        expect(error[0].msg).toEqual("Some team members repeat")
    });
    test("Create succesfully a project", async() => {
        const proj_form = {
            title: "proj test",
            description: "a description",
            team: [usersList[4]._id, usersList[1]._id, usersList[2]._id],
            teamLeader: usersList[4]._id
        }

        const res = await request(app)
            .post("/project")
            .type("form")
            .send(proj_form)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})
        expect(res.status).toEqual(200)
        expect(res.body.error).toEqual(null)
        expect(res.body.msg).toEqual("project created")
    });
    test("handles a repeated project title in db", async() => {
        const proj_form = {
            title: "proj test",
            description: "a description",
            team: [usersList[3]._id, usersList[1]._id, usersList[2]._id],
            teamLeader: usersList[3]._id
        }

        const res = await request(app)
            .post("/project")
            .type("form")
            .send(proj_form)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})
        expect(res.status).toEqual(400)
        expect(res.body.error).toEqual("Project title is already used, try with one different")
    });
    test("handles developer promoted to teamL", async() => {
        const proj_form = {
            title: "promotion project",
            description: "a description",
            team: [usersList[3]._id, usersList[1]._id, usersList[2]._id],
            teamLeader: usersList[3]._id
        }
        const res = await request(app)
            .post("/project")
            .type("form")
            .send(proj_form)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})
        
        const promotedUser = await User.findById(usersList[3]._id)
        expect(res.status).toEqual(200);
        expect(promotedUser.role).toEqual("Team leader")
    });
    test("handles team value of []", async() => {
        const testProj = {
            title: "project test....",
            description: "a description example",
            team: [],
            teamLeader: null
        }
        //test
        const res = await request(app)
            .post("/project")
            .type("form")
            .send(testProj)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})
        
        expect(res.status).toBe(400)
        expect(res.body.msg).toBe("Error with parsed form data")
        expect(res.body.error.length).toBe(1)
        expect(res.body.error[0].msg).toBe("team leader is not in the team list")
    })
})