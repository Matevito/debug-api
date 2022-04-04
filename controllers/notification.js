const Notification = require("../models/notification");
const User = require("../models/user")

exports.notificationList_get = async(req, res) => {
    const reqUser = await User.findById(req.user.id);
    if(!reqUser){
        return res.status(400).json({
            error: "error with user data on db"
        })
    };
    const notificationList = await Notification.find({ user: reqUser._id });
    if (!notificationList) {
        return res.status(400).json({
            error: "error with user-notifications data on db"
        })
    };

    res.json({
        error: null,
        msg: "user notifications",
        data: notificationList
    })
};

exports.notification_delete = async(req, res) => {
    const reqUser = await User.findById(req.user.id);
    if(!reqUser){
        return res.status(400).json({
            error: "error with user data on db"
        })
    };
    const not_toDelete = await Notification.findById(req.params.id);
    if (!not_toDelete){
        return res.status(400).json({
            error: "error with notification data on db"
        })
    };

    try {
        await Notification.findByIdAndRemove(not_toDelete._id);
        res.json({
            error: null,
            msg: "notification deleted!"
        })
    } catch(err) {
        return res.status(400).json({
            error: "error saving data on db"
        })
    }
}