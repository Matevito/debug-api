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

describe("GET /user/:id", () => {
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

    test("handles user not on db", async() => {
        const token = tokenList[0].token;
        const userTest_id = usersList[3]._id;
        await User.findByIdAndRemove(userTest_id);

        const res = await request(app)
            .get(`/user/${userTest_id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("User not found on db")
    });
    test("returns user on db", async() => {
        const token = tokenList[0].token;
        const userTest_id = usersList[4]._id;
        const res = await request(app)
            .get(`/user/${userTest_id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})

        expect(res.status).toBe(200);
        expect(res.body.error).toBe(null);
        expect(res.body.msg).toBe("user info sent successfully")
        expect(res.body.data.user._id == userTest_id).toBe(true)
        expect(res.body.data.projects.list.length).toBe(1);
        expect(res.body.data.issues.list.length).toBe(0)
    });
})