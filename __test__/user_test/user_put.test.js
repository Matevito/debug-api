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
    test("handles user that does no exist", async() => {
        const testUserId = usersList[1]._id;
        await User.findByIdAndRemove(testUserId);

        const token = tokenList[0].token;
        const res = await request(app)
            .put(`/user/${testUserId}/make-admin`)
            .type("form")
            .send({})
            .set('Accept', 'application/json')
            .set({"auth-token": token})

        expect(res.status).toBe(400)
        expect(res.body.error).toBe("error with user data on db")
    })
    test("route handles if the user :id is already an admin", async() => {
        const testUserId = usersList[0]._id;
        const token = tokenList[0].token;
        const res = await request(app)
            .put(`/user/${testUserId}/make-admin`)
            .type("form")
            .send({})
            .set('Accept', 'application/json')
            .set({"auth-token": token})
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("user is already an admin")
    });
    test("admin successfully made another user an admin", async() => {
        const testUserId = usersList[2]._id;
        const token = tokenList[0].token;
        const res = await request(app)
            .put(`/user/${testUserId}/make-admin`)
            .type("form")
            .send({})
            .set('Accept', 'application/json')
            .set({"auth-token": token})
        const newAdmin = await User.findById(testUserId);

        expect(res.status).toBe(200)
        expect(res.body.error).toBe(null)
        expect(newAdmin.role).toBe("Admin")
    });
    
})