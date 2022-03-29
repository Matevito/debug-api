const api = require("../../routes/apiv1");
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
        //todo...
        const dbData = await setupDb.getData();
        usersLists = dbData.usersList;
        testProject = dbData.project;
        tokenList = dbData.tokenList
    })
    // protection
    test.todo("protected route for users not assigned to project");
    // cleaning data
    test.todo("handle corrupted data");
    test.todo("handle incorrect parsed data");
    // functionality
    test.todo("user in team created succ an issue");
    test.todo("admin not in team succ created an issue");
});