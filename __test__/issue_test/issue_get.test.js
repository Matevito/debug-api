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

describe("GET /issue/:id/", () => {
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
    test("handles user not in the project of the issue", async() => {
        const token = tokenList[3].token;

        const res = await request(app)
            .get(`/issue/${issuesList[1]._id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token});
        
        expect(res.status).toEqual(401);
        expect(res.body.error).toBe("Access denied");
    });
    test("handles issue that already does no exist", async() => {
        const token = tokenList[2].token;

        // the issue was never saved, so it does not exist on db
        const res = await request(app)
            .get(`/issue/${issuesList[0]._id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token});

        expect(res.status).toBe(400)
        expect(res.body.error).toBe("Issue not found on db")
    })
    // issues on db index = [1,2]
    test("handles developer on the team", async() => {
        const token = tokenList[2].token;
        const issueId = issuesList[1]._id;

        const res = await request(app)
            .get(`/issue/${issueId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token});

        expect(res.status).toBe(200)
        expect(res.body.error).toBe(null)
        expect(res.body.msg).toBe("Issue sent successfully!")
        expect(res.body.data.issue._id == issueId).toBe(true)
        expect(res.body.data).toHaveProperty("changeLog")
        expect(res.body.data).toHaveProperty("comments")
    });
    test("populates hadnlingTeam usernames", async() => {
        const token = tokenList[2].token;
        const issueId = issuesList[2]._id;

        const res = await request(app)
            .get(`/issue/${issueId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token});
        
        expect(res.status).toBe(200)
        expect(res.body.error).toBe(null)
        expect(res.body.msg).toBe("Issue sent successfully!")
        expect(res.body.data.issue._id == issueId).toBe(true)
        expect(res.body.data.issue.handlingTeam[0].username).toBe("testDev2")
    });
    test.only("populates changeLog and comments", async() => {
        const token = tokenList[2].token;
        const issueId = issuesList[2]._id;

        const res = await request(app)
            .get(`/issue/${issueId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token});
        
    })
})