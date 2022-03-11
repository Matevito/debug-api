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
router.post("/demo/teamLeader", demoCont.login_teamL, authCont.login_post);
router.post("/demo/developer", demoCont.login_dev, authCont.login_post);

// ¡Protected routes!
// 2. Proyect routes
router.post("/proyect");
router.put("/proyect");
router.delete("/proyect")

router.get("/proyect/list");
router.get("/proyect/:id");

// 3. Issues routes.
router.post("/issue");
router.put("/isue");
router.delete("/issue");

router.get("/issue/list");
router.get("/issue/:id");

// 3.1 Comments routes
router.get("/issue/:id/comment/list")
router.post("/issue/:id/comment")

// 4. User routes
router.get("user/list");

// todo: 5. notifications...


module.exports = router