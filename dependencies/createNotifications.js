const Notification = require("../models/notification");

const createNotifications  = (user_list, author, ref, value, message) => {
    user_list.forEach(async (user) => {
        const new_notification = new Notification({
            user,
            author,
            ref,
            value,
            message
        });
        const saved_notification = await new_notification.save();
        if (!saved_notification) {
            return false;
        }
    });
    return true;
};


module.exports = createNotifications;