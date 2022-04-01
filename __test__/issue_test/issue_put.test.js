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

describe("PUT /issue/:id tests", () => {
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

    test("protected route for users not into the project", async () => {
        const token = tokenList[3].token;
        const res = await request(app)
            .put(`/issue/${issuesList[0]._id}`)
            .type("form")
            .send({})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})
        
        expect(res.status).toEqual(401);
        expect(res.body.error).toEqual("Access denied")
    });
    test("handles errors in parsed form data", async() => {
        const form = {
            description: "",
            status: "aditional inFo needed",
            priority: "not relevant",
            type: "Bugg-error",
        }
        const token = tokenList[0].token;
        const res = await request(app)
            .put(`/issue/${issuesList[0]._id}`)
            .type("form")
            .send(form)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})
        
        expect(res.status).toEqual(400);
        expect(res.body.msg).toEqual("error with parsed form data")
        expect(res.body.error.length).toEqual(4)
    });
    test("admins can edit a project", async() => {
        const form = {
            description: "page does not parse color squema correctly",
            status: "aditional info needed",
            priority: "low",
            type: "bugg-error",
        }
        const token = tokenList[0].token;
        const res = await request(app)
            .put(`/issue/${issuesList[0]._id}`)
            .type("form")
            .send(form)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})
        
        const editedIssue = await Issue.findById(issuesList[0]._id)

        expect(res.status).toEqual(200)
        expect(res.body.msg).toEqual("issue successfully edited!")
        expect(editedIssue.description).toBe("page does not parse color squema correctly")
        expect(editedIssue.status).toBe("aditional info needed")
        expect(editedIssue.priority).toBe("low")
        expect(editedIssue.type).toBe("bugg-error")
        expect(res.body.notifications).toBe(true)
        expect(res.body.changeLog).toBe(true)
    });
    test("developer can edit a project", async() => {
        const form = {  
            description: "docuemntation for the restAPI",
            status: "under review",
            priority: "high",
            type: "documentation req",
        };
        const token = tokenList[2].token;
        const res = await request(app)
            .put(`/issue/${issuesList[1]._id}`)
            .type("form")
            .send(form)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})

        const editedIssue = await Issue.findById(issuesList[1]._id);

        expect(res.status).toEqual(200)
        expect(res.body.msg).toEqual("issue successfully edited!")
        expect(editedIssue.description).toBe(form.description)
        expect(editedIssue.status).toBe(form.status)
        expect(editedIssue.priority).toBe(form.priority)
        expect(editedIssue.type).toBe(form.type)
        expect(res.body.notifications).toBe(true)
        expect(res.body.changeLog).toBe(true)
    });
    test("developer cannot put as solved an issue", async() => {
        const form = {  
            description: "docuemntation for the restAPI",
            status: "solved",
            priority: "high",
            type: "documentation req",
        };
        const token = tokenList[2].token;
        const res = await request(app)
            .put(`/issue/${issuesList[1]._id}`)
            .type("form")
            .send(form)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})

        expect(res.status).toBe(400)
        expect(res.body.error).not.toBe(null)
        expect(res.body.msg).toBe("error with parsed form data")
        expect(res.body.error.length).toBe(1);
    })
    test("teamL can put as solved an issue", async() => {
        const form = {  
            description: "docuemntation for the restAPI",
            status: "solved",
            priority: "high",
            type: "documentation req",
        };
        const token = tokenList[4].token;
        const res = await request(app)
            .put(`/issue/${issuesList[1]._id}`)
            .type("form")
            .send(form)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})
        
        const editedIssue = await Issue.findById(issuesList[1]._id);
        
        expect(res.status).toEqual(200)
        expect(res.body.msg).toEqual("issue successfully edited!")
        expect(editedIssue.description).toBe(form.description)
        expect(editedIssue.status).toBe(form.status)
        expect(editedIssue.priority).toBe(form.priority)
        expect(editedIssue.type).toBe(form.type)
        expect(res.body.notifications).toBe(true)
        expect(res.body.changeLog).toBe(true)
    });
    test("admin can put as solved an issue", async() => {
        const form = {  
            description: "documentation for frontEnd",
            status: "solved",
            priority: "high",
            type: "documentation req",
        };
        const token = tokenList[0].token;

        const res = await request(app)
            .put(`/issue/${issuesList[2]._id}`)
            .type("form")
            .send(form)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})
        
        const editedIssue = await Issue.findById(issuesList[2]._id);

        expect(res.status).toEqual(200)
        expect(res.body.msg).toEqual("issue successfully edited!")
        expect(editedIssue.description).toBe(form.description)
        expect(editedIssue.status).toBe(form.status)
        expect(editedIssue.priority).toBe(form.priority)
        expect(editedIssue.type).toBe(form.type)
        expect(res.body.notifications).toBe(true)
        expect(res.body.changeLog).toBe(true)
    });
    test("handles if form is not different from current issue", async() => {
        const issueToTest = await Issue.findById(issuesList[2]._id);
        const token = tokenList[0].token;
        const form = {
            description: issueToTest.description,
            status: issueToTest.status,
            priority: issueToTest.priority,
            type: issueToTest.type,
        };
        
        const res = await request(app)
            .put(`/issue/${issuesList[2]._id}`)
            .type("form")
            .send(form)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set({"auth-token": token})
        
        expect(res.status).toBe(200);
        expect(res.body.error).toBe(null)
        expect(res.body.notifications).toBe(false);
        expect(res.body.changeLog).toBe(false)
    })
})