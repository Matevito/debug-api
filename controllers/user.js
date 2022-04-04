const User = require("../models/user")

exports.userList_get = async(req, res) => {
    const userList = await User.find({})
    if (!userList) {
        return res.status(400).json({
            error: "users on db not found"
        })
    };

    res.json({
        error: null,
        msg: "user-list sent successfully",
        data: userList
    })
};
exports.user_get = (req, res) => {

};
exports.user_put = (req, res) => {

};