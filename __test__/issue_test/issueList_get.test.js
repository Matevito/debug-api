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

describe("GET /project/:id/issue/", () => {
    let usersLists;
    let testProject;
    let tokenList;

    beforeAll(async() => {
        await testDB();
        const dbData = await setupDb.getData();
        usersLists = dbData.usersList;
        testProject = dbData.project;
        tokenList = dbData.tokenList;
        const issuesForm = [
            {
                title: "issue 1",
                description: "a description",
                project: testProject._id,
                status: "open",
                priority: "mid",
                type: "feature req",
                screenshots: []
            },
            {
                title: "issue 2",
                description: "a description",
                project: testProject._id,
                status: "open",
                priority: "high",
                type: "bugg-error",
                screenshots: [] 
            }
        ];
        issuesForm.forEach(async (form) => {
            const new_issue = new Issue(form)
            await new_issue.save()
        });
    })

    test("user in team acccess to all issues of a project", async() => {
        const token = tokenList[4].token;
        const res = await request(app)
            .get(`/project/${testProject._id}/issue/list`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})

        expect(res.status).toBe(200)
        expect(res.body.error).toBe(null)
        expect(res.body.msg).toEqual("send Issue list")
        expect(res.data.length).toEqual(2)
        expect(res.data[0].title).toEqual("issue 1")
        expect(res.data[1].title).toEqual("issue 2")
    })
    test("admin can access the route", async() => {
        const token = tokenList[0].token;
        const res = await request(app)
            .get(`/project/${testProject._id}/issue/list`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})

        expect(res.status).toBe(200)
        expect(res.body.error).toBe(null)
        expect(res.body.msg).toEqual("send Issue list")
        expect(res.data.length).toEqual(2)
        expect(res.data[0].title).toEqual("issue 1")
        expect(res.data[1].title).toEqual("issue 2")
    })
});
