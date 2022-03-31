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

    test.only("admins can edit a project", async() => {
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
        //console.log(res.body)
        expect(res.status).toEqual(200)
        expect(res.body.msg).toEqual("issue successfully edited!")
        expect(editedIssue.description).toBe("page does not parse color squema correctly")
        expect(editedIssue.status).toBe("aditional info needed")
        expect(editedIssue.priority).toBe("low")
        expect(editedIssue.type).toBe("bugg-error")
        expect(res.body.notifications).toBe(true)
        expect(res.body.changelog).toBe(true)
    });
    test.todo("developer can edit a project");

    test.todo("developer cannot put as solved an issue")
    test.todo("teamL can put as solved an issue");

    test.todo("admin can put as solved an issue");

})
