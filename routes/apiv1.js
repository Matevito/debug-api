const express = require("express");

const router = express.Router();

const authCont = require("../controllers/auth");
// 1. auth routes
router.post("/sign-in");
router.post("/log-in");
router.get("/whoami");

// 1.5 demo auth routes
router.post("/demo/developer");
router.post("/demo/teamLeader");
router.post("/demo/admin");

// 2. Proyect routes


// 3. Issues routes.

// 3.1 Comments routes

// todo: other routers

module.exports = router