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
    test("handles user not assigned to a project", async() => {
        // user not assigned = 3
        const users = await userList()
        let userToken = await request(app)
            .post("/log-in")
            .type("form")
            .send({
                username: users[3].email,
                password: users[3].password
            })
        userToken = userToken.body.token

        //test
        let res = await request(app)
            .get("/project/list")
            .set('Accept', 'application/json')
            .set({"auth-token": userToken})
        
        expect(res.status).toEqual(200);
        expect(res.body.error).toEqual(null);
        expect(res.body.data.length).toEqual(0);
    })
    test("admin gets all projects on db", async() => {
        const users = await userList();
        let adminToken = await request(app)
            .post("/log-in")
            .type("form")
            .send({
                username: users[0].username,
                password: users[0].password
            })
        adminToken = adminToken.body.token

        // test
        //test
        let res = await request(app)
            .get("/project/list")
            .set('Accept', 'application/json')
            .set({"auth-token": adminToken})
        
        //console.log(res.body)
        expect(res.status).toEqual(200);
        expect(res.body.error).toEqual(null);
        expect(res.body.data.length).toEqual(3);
    });
    test("dev gets proj where is part of the team", async() => {
        const users = await userList();
        let userToken = await request(app)
            .post("/log-in")
            .type("form")
            .send({
                username: users[4].email,
                password: users[4].password
            })
        userToken = userToken.body.token

        //test
        let res = await request(app)
            .get("/project/list")
            .set('Accept', 'application/json')
            .set({"auth-token": userToken})
            
        expect(res.status).toEqual(200)
        expect(res.body.error).toEqual(null)
        expect(res.body.data.length).toEqual(2)
        expect(res.body.data[0].title).toEqual("proj1")
        expect(res.body.data[1].title).toEqual("proj2")
    })
})