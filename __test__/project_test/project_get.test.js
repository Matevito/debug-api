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

describe("GET /project/:id tests", () => {
    //forms
    let projForm

    //DBinfo
    let savedUsers;
    let projId;

    beforeAll(async() => {
        await testDB();

        // save users on db
        const users = await userList();
        savedUsers = await saveUsers(users);

        projForm = {
            title: "proj to tests",
            description: "an example...",
            team: [savedUsers[4]._id, savedUsers[1]._id],
            teamLeader: savedUsers[4]._id
        };
        let savedPrj =new Project(projForm);
        savedPrj = await savedPrj.save();
        projId = savedPrj._id

    })
    //test.todo("handles :id that does not exist")
    test("handles user not assigned to proj", async () => {
        const users = await userList();
        let devToken = await request(app)
            .post("/log-in")
            .type("form")
            .send({
                username: users[2].username,
                password: users[2].password
            });
        devToken = devToken.body.token;
        
        // test
        const res = await request(app)
            .get(`/project/${projId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": devToken})
        
        expect(res.status).toEqual(401);
        expect(res.body.error).toEqual("Access denied")
    })
    test("admin has access", async() => {
        const users = await userList();
        let adminToken = await request(app)
            .post("/log-in")
            .type("form")
            .send({
                username: users[0].username,
                password: users[0].password
            })
        adminToken = adminToken.body.token

        //test
        const res = await request(app)
            .get(`/project/${projId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": adminToken})
            
        expect(res.status).toEqual(200)
        expect(res.body.error).toEqual(null)
        expect(res.body.data._id == projId).toBe(true)
    })
    test("handles user assigned to project", async() => {

        const users = await userList();
        let devToken = await request(app)
            .post("/log-in")
            .type("form")
            .send({
                username: users[1].username,
                password: users[1].password
            });
        devToken = devToken.body.token

        //test
        const res = await request(app)
            .get(`/project/${projId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": devToken})

        expect(res.status).toEqual(200)
        expect(res.body.error).toEqual(null)
        expect(res.body.data._id == projId).toEqual(true)
    })
})