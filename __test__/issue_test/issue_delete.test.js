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

describe("DELETE /issue/:id", () => {
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
        issuesList.forEach(async(issue, index) => {
            if (index == 0) {
                return false
            }
            await issue.save()
        })

    });
    test("handles user outside the project", async() => {
        // #3
        const token = tokenList[3].token;
        const issueId = issuesList[1]._id
        const res = await request(app)
            .delete(`/issue/${issueId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token});

        console.log(res.body)
    });
    test.todo("handles developer inside the project");
    test.todo("handles teamL of the project");
    // index = 0
    test.todo("handles a project that no longer exist on db");

    test("admin can delete a proj and its related data", async() => {
        const token = tokenList[0].token;
        const issueId = issuesList[2]._id
        const res = await request(app)
            .delete(`/issue/${issueId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token});

        // todo....
        console.log(res.body)
    });
})