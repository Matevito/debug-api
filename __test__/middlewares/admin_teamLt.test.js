const admin_teamL = require("../../dependencies/middlewares/admin_teamL");
const setUser = require("./setUser");

const request = require("supertest");
const express = require("express");
const testDB = require("../mongoConfigTesting");
const app = express();

app.use(express.urlencoded({ extended: false }));

// route to test the middleware
// req.user = { id, username, role }
// :id = id of the proyect
app.get("/:id", setUser, admin_teamL, (req, res) => {
    res.status(200).json({
        error: null,
        msg: "Test passed"
    })
})
//testDB();

const devUser = {
    username: "a normal user",
    role: "Developer",
    id: 1
};
const teamUser = {
    username: "team l",
    role: "Team Leader",
    id: 2
};
const adminUser = {
    username : "expampleAdmin",
    role : "Admin",
    id : 3
}

describe("admin or teamLeader tests", () => {
    test("User is an admin" , async () => {
        const res = await request(app)
                            .get("/1")
                            .type("form")
                            .send(adminUser)
        expect(res.status).toEqual(200)
        expect(res.body.msg).toEqual("Test passed")     
        expect(res.body.error).toEqual(null)            
    });
    test.todo("User is a team leader on the proyect");
    test.todo("User is a team leader but not of the proyect");
    test.todo("User is a developer");
})