const express = require("express");

const router = express.Router();

const authCont = require("../controllers/auth");
const demoCont = require("../controllers/demo");

// 1. auth routes
router.post("/sign-in", authCont.signin_post);
router.post("/log-in", authCont.login_post);
router.get("/whoami");

// 1.5 demo auth routes
router.post("/demo/admin", demoCont.login_admmin, authCont.login_post);
router.post("/demo/teamLeader");
router.post("/demo/developer");

// 2. Proyect routes


// 3. Issues routes.

// 3.1 Comments routes

// todo: other routers

// 4. User routes

// 5. notifications...


module.exports = router