const User = require("../models/user");
const userList = [
    {
        username: "testAdmin",
        email: "test@email.com",
        password: "example..",
        role: "Admin",
    },
    {
        username: "testDev1",
        email: "test2@email.com",
        password: "example..",
        role: "Developer",
    },
    {
        username: "testDev2",
        email: "test3@email.com",
        password: "example..",
        role: "Developer",
    },
    {
        username: "testDev-teamL",
        email: "test4@email.com",
        password: "example..",
        role: "Developer",
    },
    {
        username: "test-TeamL",
        email: "test4@email.com",
        password: "example...",
        role: "Team leader"
    }
];

exports.get_users = async() => {
    let user_list = []
    userList.forEach(async (user )=> {
        const user_obj = new User(user);
        user_list.push(user_obj)
    });
    return user_list;
};