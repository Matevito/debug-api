const api = require("../../routes/apiv1");
const Issue = require("../../models/issue");
const express = require("express");

if (process.env.NODE_ENV !== 'production') require("dotenv").config();

const request = require("supertest");
const testDB = require("../mongoConfigTesting");
// db set-up
const setupDb = require("./setupDb");

jest.setTimeout(30000);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", api);

describe("POST /project/:id/issue tests", () => {
    let usersLists;
    let testProject;
    let tokenList;

    beforeAll(async() => {
        await testDB();

        const dbData = await setupDb.getData();
        usersLists = dbData.usersList;
        testProject = dbData.project;
        tokenList = dbData.tokenList
    })
    // protection
    test("protected route for users not assigned to project", async() => {
        // #3 is the user that cannot access the route
        const token = tokenList[3].token

        //tests
        const res = await request(app)
            .post(`/project/${testProject._id}/issue`)
            .type("form")
            .send({})
            .set({"auth-token": token})
        
        expect(res.status).toEqual(401);
        expect(res.body.error).toEqual("Access denied")
    });

    // cleaning data
    test.only("handle corrupted data", async () => {
        const form = {
            title: "a title",
            description: " a description",
            project: testProject._id,
            priority: "miD",
            type: "bugg-Error",
        };
        const res = await request(app)
            .post(`/project/${testProject._id}/issue`)
            .type("form")
            .send(form)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": tokenList[0].token})

        expect(res.status).toEqual(400);
        expect(res.body.error).not.toBe(null)
        expect(res.body.msg).toEqual("error with parsed form data")
        expect(res.body.error.length).toEqual(2)
    });
    // functionality
    test("user in team can create an issue", async () => {
        const form = {
            title: "a title x2 ",
            description: "a description ...",
            project: testProject._id,
            priority: "mid",
            type: "bugg-error",
        };
        const res = await request(app)
            .post(`/project/${testProject._id}/issue`)
            .type("form")
            .send(form)
            .set({"auth-token": tokenList[1].token})
        
        const createdIssue = await Issue.find({ title: "a title x2"})
        expect(res.status).toBe(200)
        expect(res.body.error).toBe(null)
        expect(res.body.msg).toEqual("Issue created")
        expect(res.body.data.title).toEqual("a title x2")
    });
    test("admin not in team succ created an issue", async() => {
        const token = tokenList[0].token;
        const form = {
            title: "a title x4",
            description: "a description ...",
            project: testProject._id,
            priority: "mid",
            type: "feature req",
        };
        // test
        const res = await request(app)
            .post(`/project/${testProject._id}/issue`)
            .type("form")
            .send(form)
            .set({"auth-token": token})
        
        const createdIssue = await Issue.find({ title: "a title x4"})

        expect(res.status).toBe(200)
        expect(res.body.error).toBe(null)
        expect(res.body.msg).toEqual("Issue created")
        expect(res.body.data.title).toEqual("a title x4")
    
    });
});