const api = require("../../routes/apiv1");
const express = require("express");
const User = require("../../models/user");
const Project = require("../../models/project");

if (process.env.NODE_ENV !== 'production') require("dotenv").config();

const request = require("supertest");
const testDB = require("../mongoConfigTesting");
const userList = require("../userList").get_users

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", api);

describe("edit_project test", () => {
    let token;
    let form;
    let usersList;

    beforeAll(async() => {
        await testDB();
    });

    test.todo("route handles blank form");
    test.todo("protected route for users not in the team");
    test.todo("protected route for developers on the team");
    test.todo("sucessfully edit a title and description");
    test.todo("successfully edits a team, and teamL");
})