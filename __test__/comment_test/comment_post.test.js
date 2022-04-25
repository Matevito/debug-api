const api = require("../../routes/apiv1");
const Issue = require("../../models/issue");
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

describe("POST /issue/:id/comment", () => {
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

    test("handles user outside project", async() => {
        const token = tokenList[3].token;
        const issueId = issuesList[1]._id;

        const res = await request(app)
            .post(`/issue/${issueId}/comment`)
            .type("form")
            .send({})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token});

        expect(res.status).toBe(401)
        expect(res.body.error).toBe("Access denied");
    });
    test("handles project that does not exist", async() => {
        const token = tokenList[2].token;
        const issueId = issuesList[0]._id;

        const res = await request(app)
            .post(`/issue/${issueId}/comment`)
            .type("form")
            .send({})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token});

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Issue not found on db")
    })
    test("handles corrupted comment form data", async() => {
        const token = tokenList[2].token;
        const issueId = issuesList[1]._id;
        const res = await request(app)
            .post(`/issue/${issueId}/comment`)
            .type("form")
            .send({
                message: ""
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token});

        expect(res.status).toBe(400);
        expect(res.body.msg).toBe("error with parsed form data");
        expect(res.body.error.length).toBe(1);
        expect(res.body.error[0].msg).toBe("a message for the comment is required")
    })
    test("successfully saves comment on db", async() => {
        const token = tokenList[2].token;
        const issueId = issuesList[1]._id;
        const res = await request(app)
            .post(`/issue/${issueId}/comment`)
            .type("form")
            .send({
                message: "a test comment"
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token});
        
        expect(res.status).toBe(200)
        expect(res.body.error).toBe(null)
        expect(res.body.msg).toBe("Comment saved successfully")

        // it populates correctly user data
        const commentList = res.body.data.commentList;
        expect(commentList[0].user.username).toBe(tokenList[2].username)
    });
    test("get issue controller displays comments saved", async() => {
        const token1 = tokenList[2].token;
        const token2 = tokenList[4].token;
        const issueId = issuesList[2]._id;
        const res1 = await request(app)
            .post(`/issue/${issueId}/comment`)
            .type("form")
            .send({
                message: "first comment"
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token1});
        const res2 = await request(app)
            .post(`/issue/${issueId}/comment`)
            .type("form")
            .send({
                message: "second comment"
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token2});

        // test
        const testRes = await request(app)
            .get(`/issue/${issueId}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token2});

        expect(res1.status).toBe(200);
        expect(res2.status).toBe(200);
        expect(testRes.body.data.comments.length).toBe(2)
    })
    
    //todo test screenshots saving
})