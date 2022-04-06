const get_projectData = require("../../../dependencies/get_projectData");

const Issue = require("../../../models/issue");
const Comment = require("../../../models/comment");

if (process.env.NODE_ENV !== 'production') require("dotenv").config();

const testDB = require("../../mongoConfigTesting");

const setupDb1 = require("../../issue_test/setupDb");
const setupdb2 = require("./mockProjectdata");

jest.setTimeout(30000);


describe("test funct get_projectData", () => {
    let proj1;
    let proj2;
    let usersList;
    beforeAll(async() => {
        await testDB();
        // set up db 1
        const project1_data = await setupDb1.getData();
        usersList = project1_data.usersList;
        proj1 = {
            project: project1_data.project,
            issues: project1_data.issues
        };
        project1_data.issues.forEach(async(issue) => {
            await issue.save();
        });
        
        // set up db 2
        const project2_data = await setupdb2.getData(usersList);
        proj2 = {
            project: project2_data.project,
            issues: project2_data.issues,
            comments: project2_data.comments,
            changeLog: project2_data.changeLog
        }
    })
    test("returns related data proj1", async() => {
        const projectId = proj1.project._id;
        const res = await get_projectData(projectId);
        
        expect(res.issues.length).toBe(3);
        expect(res.issues[0].title).toBe("issue 1");
        expect(res.issues[1].title).toBe("issue 2");
        expect(res.issues[2].title).toBe("issue 3");
        expect(res.comments.length).toBe(0);
        expect(res.changeLogs.length).toBe(0);
    });
    test("returns related data prj2", async() => {
        const projectId = proj2.project._id;
        const res = await get_projectData(projectId);
        
        expect(res.issues.length).toBe(3);
        expect(res.issues[0].title).toBe("issue 4");
        expect(res.issues[1].title).toBe("issue 5");
        expect(res.issues[2].title).toBe("issue 6");

        expect(res.comments.length).toBe(2);
        expect(res.comments[0].message).toBe("first comment");
        expect(res.comments[1].message).toBe("second comment");
        expect(res.changeLogs.length).toBe(1);
    });

})