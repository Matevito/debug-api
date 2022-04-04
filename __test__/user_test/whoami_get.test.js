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

describe("GET /whoami", () => {
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
    test("handles user that does not exist", async() => {
        const testUserId = usersList[1]._id;
        await User.findByIdAndRemove(testUserId);

        const token = tokenList[1].token;
        const res = await request(app)
            .get(`/whoami`)
            .set('Accept', 'application/json')
            .set({"auth-token": token})
        
        expect(res.status).toBe(400)
        expect(res.body.error).toBe("error with user data on db")
    });
    test("sends user info on db according to jwt info", async() => {
        const testUserId = usersList[0]._id;
        const token = tokenList[0].token;
        const res = await request(app)
            .get("/whoami")
            .set("Accept", "application/json")
            .set({"auth-token": token})

        expect(res.status).toBe(200)
        expect(res.body.error).toBe(null);
        expect(res.body.data.username).toBe(usersList[0].username)
        expect(res.body.data.email).toBe(usersList[0].email)
        expect(res.body.data.id == testUserId).toBe(true)
        expect(res.body.data.role).toBe(usersList[0].role)
    })
})