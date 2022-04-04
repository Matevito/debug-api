const api = require("../../routes/apiv1");
const express = require("express");
const User = require("../../models/user")
if (process.env.NODE_ENV !== 'production') require("dotenv").config();

const request = require("supertest");
const testDB = require("../mongoConfigTesting");
// db set-up
const setupDb = require("../issue_test/setupDb");

jest.setTimeout(30000);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", api);

describe("PUT /user/:id/make-admin", () => {
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
    });

    test("route protected for devs", async() => {
        const token = tokenList[3].token
        const testUserId = usersList[2]._id;

        const res = await request(app)
            .put(`/user/${testUserId}/make-admin`)
            .type("form")
            .send({})
            .set('Accept', 'application/json')
            .set({"auth-token": token})

        expect(res.status).toBe(401);
        expect(res.body.error).toBe("Access denied")
    }),
    test("route protected for teamL", async() => {
        const token = tokenList[4].token
        const testUserId = usersList[2]._id;

        const res = await request(app)
            .put(`/user/${testUserId}/make-admin`)
            .type("form")
            .send({})
            .set('Accept', 'application/json')
            .set({"auth-token": token})

        expect(res.status).toBe(401);
        expect(res.body.error).toBe("Access denied");
    });
    test.todo("handles user that does no exist")
    test.todo("route handles if the user :id is already an admin");
    test.todo("admin successfully made another user an admin");
    
})