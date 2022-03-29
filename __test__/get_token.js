if (process.env.NODE_ENV !== "production") require("dotenv").config({ path: "../"})
const jwt = require("jsonwebtoken");

const get_token = (userObj) => {
    const userData = {
        id: userObj._id,
        username: userObj.username,
        role: userObj.role
    }
    const secret = process.env.TOKEN_SECRET;
    const opts = { expiresIn: "15d" };
    const token = jwt.sign(userData, secret, opts) 
    return token
};
module.exports = get_token;