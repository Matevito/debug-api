const express = require("express");

const router = express.Router();

const authCont = require("../controllers/auth");

// 1. auth routes
router.post("/sign-in", authCont.signin_post);
router.post("/log-in", authCont.login_post);
router.get("/whoami");

// 1.5 demo auth routes
router.post("/demo/developer");
router.post("/demo/teamLeader");
router.post("/demo/admin");

// 2. Proyect routes


// 3. Issues routes.

// 3.1 Comments routes

// todo: other routers

// 4. notifications...

module.exports = router