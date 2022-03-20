const api = require("../../routes/apiv1");
const express = require("express");
const Project = require("../../models/project");
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

const saveUsers = async(users) => {
    let user_list = [];
        users.forEach(async(user) => {
            const new_user = await user.save()
            user_list.push(new_user)
        })
    return user_list
}

describe("DELETE project/:id tests", () => {
    // tokens
    let adminToken;
    let devToken;
    let teamLtoken;
    // call forms
    let adminForm;
    let projForm;
    // db info
    let usersList;
    let projId;

    beforeAll(async() => {
        await testDB();

        // save users on db
        const users = await userList();
        usersList = await saveUsers(users);

        // needed to call log-in on tests
        adminForm = {
            username: users[0].username,
            password: users[0].password
        }
        adminToken = await request(app)
            .post("/log-in")
            .type("form")
            .send(adminForm)
        // set up prjForm
        projForm = {
            title: "proj to test",
            description: "an  example of a description",
            team: [usersList[4]._id, usersList[1]._id],
            teamLeader: usersList[4]._id
        };
    })
    
    test("route protected for devs", async () => {
        // set up token and project to tests
        const users = await userList();
        devToken = await request(app)
            .post("/log-in")
            .type("form")
            .send({
                username: users[1].username,
                password: users[1].password
            })
        devToken = devToken.body.token
        
        let savedProject = new Project(projForm);
        savedProject = await savedProject.save();
        projId = savedProject._id

        // tests
        const res = await request(app)
            .delete(`/project/${projId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": devToken})

        expect(res.status).toEqual(401);
        expect(res.body.error).toEqual("Access denied")
    });
    
    test("route protected for Team leaders", async() => {
        // set-upof test token
        const users = await userList();
        teamLtoken = await request(app)
            .post("/log-in")
            .type("form")
            .send({
                username: users[4].username,
                password: users[4].password
            });
        teamLtoken = teamLtoken.body.token
        
        // tests
        const res = await request(app)
            .delete(`/project/${projId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": teamLtoken})
        expect(res.status).toEqual(401);
        expect(res.body.error).toEqual("Access denied");
    });
    
    test("admin deletes successfully a project", async () => {
        // set up admin token
        adminToken = await request(app)
            .post("/log-in")
            .type("form")
            .send(adminForm)
        adminToken = adminToken.body.token;

        // test
        const res = await request(app)
            .delete(`/project/${projId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": adminToken})
        const removedPrj = await Project.findById(projId);

        expect(res.status).toEqual(200)
        expect(res.body.error).toEqual(null)
        expect(removedPrj).toEqual(null)
    });
    
    test("handles a project that does not exist", async () => {
        const testId = "todo:... valid mongoddb id"
        const res = await request(app)
            .delete(`/project/${projId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": adminToken})
            
        expect(res.status).toEqual(400)
        expect(res.body.error).toEqual("Project not found")
    });
    
})