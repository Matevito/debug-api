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


describe("PUT /issue/:id/take-issue", () => {
    let usersList;
    let testProject;
    let tokenList;
    let issuesList;
    
    beforeAll(async() => {
        await testDB();
        const dbData = await setupDb.getData();
        
        testProject = dbData.project;
        tokenList = dbData.tokenList;
        usersList = dbData.usersList;
        issuesList = dbData.issues;
        issuesList.forEach(async(issue) => {
            await issue.save()
        })
    })

    test.only("route protected from user not in the proj team", async() => {
        const token = tokenList[3].token;

        const res = await request(app)
            .put(`/issue/${issuesList[0]._id}/take-issue`)
            .type("form")
            .send({})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token});

        expect(res.status).toEqual(401);
        expect(res.body.error).toBe("Access denied");
    });
    test.todo("route handles a user part of the issue handling-team");

    test.todo("route adds to the issue team a developer");
    test.todo("route handles a team with users already in it")
})