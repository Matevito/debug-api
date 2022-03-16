const api = require("../../routes/apiv1");
const express = require("express");

if (process.env.NODE_ENV !== 'production') require("dotenv").config();

const request = require("supertest");
const testDB = require("../mongoConfigTesting");
const populateDb = require("../populateDb");

const app = express();

app.use("/", api);

describe("create_project tests", () => {
    beforeAll(async() => {
        await testDB()
    })
    test.todo("create project");
    test("sign-in handles incopmplete form data", done => {
        request(app)
            .post("/sign-in")
            .type("form")
            .send({
                username: "a random name",
                password: "a random password"
            })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400, done);
    });
})