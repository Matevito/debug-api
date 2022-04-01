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
    test.todo("route protected from user not in the proj team");
    test.todo("route handles a user not part of the issue handling-team");

    test.todo("route removes successfully a developer from the team");
})