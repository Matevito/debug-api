const api = require("../../routes/apiv1");
const express = require("express");

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

describe("GET /user/list", () => {
    let usersList;
    let testProject;
    let tokenList;
    beforeAll(async() => {
        await testDB();
        const dbData = await setupDb.getData();
    
        testProject = dbData.project;
        tokenList = dbData.tokenList;
        usersList = dbData.usersList;
    });

    test("admin gets list of users on db", async() => {
        const token = tokenList[0].token;

        const res = await request(app)
            .get(`/user/list`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token});

        expect(res.status).toBe(200);
        expect(res.body.error).toBe(null);
        expect(res.body.msg).toBe("user-list sent successfully");
        expect(res.body.data.length).toBe(5);
    })
})