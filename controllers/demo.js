if (process.env.NODE_ENV !== 'production') require("dotenv").config({ path: '../' })
exports.login_admmin = (req, res, next) => {
    let admin_info = process.env.ADMIN_SEC.split(" ");

    req.body.username = String(admin_info[0]);
    req.body.password = String(admin_info[1]);
    next()
};

exports.login_teamL = (req, res, next) => {

};

exports.login_dev = (req, res, next) => {

};