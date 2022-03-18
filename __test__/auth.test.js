const api = require("../routes/apiv1");

if (process.env.NODE_ENV !== 'production') require("dotenv").config();

const request = require("supertest");
const express = require("express");
const testDB = require("./mongoConfigTesting");
const app = express();

app.use(express.urlencoded({ extended: false }));

app.use("/", api);

describe("auth tests", () => {
    beforeAll(async () => {
        await testDB()
    });

    test("sign-in handles incomplete form data", done => {
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
    
    test("sign-in handles correct forms", async () => {
        const form = {
            username: "a random name",
            password: "a random password",
            repeatPassword: "a random password",
            email: "example@hotmail.lat"
        }
        const res = await request(app)
                            .post("/sign-in")
                            .type("form")
                            .send(form)
        expect(res.body.error).toEqual(null);
        expect(res.body.msg).toEqual("User created succesfully");
    })
    
    test("login status 200 if a user exist", async () => {
        const form = {
            username: "a random name",
            password: "a random password"
        };
        const res = await request(app)
                            .post("/log-in")
                            .type("form")
                            .send(form)
        expect(res.status).toEqual(200);
    })
    
    test("login return a token if user valid", async () => {
        const form = {
            username: "a random name",
            password: "a random password"
        };
        const res = await request(app)
                            .post("/log-in")
                            .type("form")
                            .send(form)
        expect(res.body.token).toBeDefined();
    })
    
    test("login handles incomplete form data", async () => {
        const form = {
            username: "idon't exist",
            password: ""
        };
        const res = await request(app)
            .post("/log-in")
            .type("form")
            .send(form)
        expect(res.status).toEqual(400)
    })
    
    test("login handles a user that does not exist", async () => {
        const form = {
            username: "idon't exist",
            password: "a random password"
        };
        const res = await request(app)
            .post("/log-in")
            .type("form")
            .send(form)
        expect(res.status).toEqual(400)
        expect(res.body.error).toEqual("User not found")
    })
})