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
                msg: "error with parsed form data",
                error: errors.array()
            })
        };

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
            // developer as default value
            role: "Developer"
        });
        try {
            await new_user.save();
            res.json({ 
                error: null,
                msg: "User created succesfully",
            })
        } catch (err) {
            res.status(400).json({ err })
        }
    }
]

exports.login_post = [
    body("username", "username or email is required").trim().not().isEmpty().escape(),
    body("password", "Password is required").trim().isLength({ min: 5 }).escape(),
    async (req, res) => {
        // 1. check validity of data
        let errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({
                msg: "error with parsed data",
                error: errors.array()
            })
        }

        // 2. check if user exist
        let user = await User.findOne({ username: req.body.username })
        if (!user) {
            user = await User.findOne({ email: req.body.username })
        };
        if (!user) {
            return res.status(400).json({
                error: "User not found"
            })
        }

        // 3. check parsed password validity
        const validPassword = await user.checkPassword(req.body.password);
        if (!validPassword) {
            return res.status(400).json({
                error: "Invalid password"
            })
        }

        // 4. send jwt token to client
        const userData = {
            id: user._id,
            username: user.username,
            role: user.role
        }

        const secret = process.env.TOKEN_SECRET;
        const opts = { expiresIn: "15d" };
        const token = jwt.sign(userData, secret, opts);

        res.json({
            error: null,
            msg: "validation sucessfull",
            token
        })
    }
]