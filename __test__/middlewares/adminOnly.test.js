const adminOnly = require("../../dependencies/middlewares/adminOnly")
const setUser = require("./setUser");

const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));

// route to test the middleware
// req.user = { id, username, role }
app.get("/", setUser, adminOnly, (req, res) => {
    res.status(200).json({
        error: null,
        msg: "Test passed"
    })
})

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

// test of the middleware

describe("adminOnly middleware", () => {
    test("handles if user is a developer", async () => {
        const res = await request(app)
                        .get("/")
                        .type("form")
                        .send(devUser)
        expect(res.status).toEqual(401)
        expect(res.body.error).toEqual("Access denied")
    });
    test("handles if user is a team leader", async () => {
        const res = await request(app)
                            .get("/")
                            .type("form")
                            .send(teamUser)
        expect(res.status).toEqual(401)
        expect(res.body.error).toEqual("Access denied")
    });
    test("handles if user is an Admin", async () => {
        const res = await request(app)
                            .get("/")
                            .type("form")
                            .send(adminUser)
        expect(res.status).toEqual(200)
        expect(res.body.error).toEqual(null)
    })
})