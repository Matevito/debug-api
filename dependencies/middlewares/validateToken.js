if (process.env.NODE_ENV !== 'production') require("dotenv").config({ path: '../' })
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.header("auth-token");

    if (!token) {
        return res.status(401).json({
            error: "Access denied"
        })
    };
    try {
        // check token validity
        const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verifiedUser;
        // req.user = { id, username, role}
        next();
    } catch (err) {
        res.status(400).json({
            error: "Invalid token"
        })
    }
};

module.exports = verifyToken;