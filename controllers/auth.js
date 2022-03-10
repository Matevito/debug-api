if (process.env.NODE_ENV !== 'production') require("dotenv").config({ path: '../' })
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.signin_post = [
    // validate and sanitize data.
    body("username", "Username required").trim().not().isEmpty().escape(),
    body("email", "Valid email is required").trim().isEmail().normalizeEmail().escape(),
    body("password", "Invalid password").trim().isLength({ min: 5 }).escape(),
    body("repeatPasword").custom((value, { req }) => {
        // check password equality
        if (value !== req.body.password) {
            throw new Error("Passwords don't match!");
        }
        return true;
    }).escape(),
    async (req, res) => {
        // 1. check validity of data
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            // if there are errors
            return res.status(400).json({
                message: "error with parsed form data",
                error: errors.array()
            })
        };s

        // 2. check if user already exist
        const usernameExist = await User.findOne({ username: req.body.username });
        const emailExist = await User.findOne({ email: req.body.email });
        
        if (usernameExist || emailExist) {
            return res.status(400).json(
                {
                    error: "A user with the parsed username or email is already registered!"
                }
            )
        };
    
        // 3. save user
        const new_user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: "Developer"
        });

        try {
            //todo: save user
            res.json({ 
                error: null,
                message: "User created succesfully",
                data: new_user
            })
        } catch (err) {
            res.status(400).json({ err })
        }
    }
]

exports.login_post = async (req, res) => {
    res.send("todo:")
};