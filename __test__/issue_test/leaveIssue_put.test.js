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


describe("PUT /issue/:id/leave-issue", () => {
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
    test("route protected from user not in the proj team", async() => {
        const token = tokenList[3].token;

        const res = await request(app)
            .put(`/issue/${issuesList[0]._id}/leave-issue`)
            .type("form")
            .send({})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token});

        expect(res.status).toEqual(401);
        expect(res.body.error).toBe("Access denied");
    });
    test.only("route handles a user not part of the issue handling-team", async() => {
        const token = tokenList[2].token;

        const res = await request(app)
            .put(`/issue/${issuesList[1]._id}/leave-issue`)
            .type("form")
            .send({})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token});

        console.log(res.body)
        expect(res.status).toEqual(400);
        expect(res.body.error).toBe("User is not part of the issue-team");
    });

    test.todo("route removes successfully a user from the team");
})