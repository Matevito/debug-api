const express = require("express");
const router = express.Router();

// controllers
const authCont = require("../controllers/auth");
const demoCont = require("../controllers/demo");
const proyCont = require("../controllers/project");

// middlewares
const validateToken = require("../dependencies/middlewares/validateToken");
    // all middlewares require user { _id, username, role}

// sanitize forms
const sanitizeProject = require("../dependencies/middlewares/sanitizeProject");

    // 1. auth routes
router.post("/sign-in", authCont.signin_post);
router.post("/log-in", authCont.login_post);
router.get("/whoami");

// 1.5 demo auth routes
router.post("/demo/admin", demoCont.login_admmin, authCont.login_post);
router.post("/demo/teamLeader", demoCont.login_teamL, authCont.login_post);
router.post("/demo/developer", demoCont.login_dev, authCont.login_post);

// ¡Protected routes!
    // all the following routes are protected.
//router.use(validateToken);

// 2. project routes
router.post("/project", sanitizeProject, proyCont.project_post);

router.put("/project/:id", proyCont.project_put);
router.delete("/project/:id", proyCont.project_delete)

router.get("/project/list", proyCont.projectList_get);
router.get("/project/:id", proyCont.project_get);

// 3. Issues routes.
router.post("/issue");
router.put("/isue/:id");
router.delete("/issue/:id");

router.get("/issue/list");
router.get("/issue/:id");

// 3.1 Comments routes
router.get("/issue/:id/comment/list")
router.post("/issue/:id/comment")

// 4. User routes
router.get("/user/list");
router.get("/user/:id")
    // edit user data - only for admins
    // /user/:ID/status ? only for admins?
router.put("/user/:id");

// todo: other type of callbacks
router.get("/notification/list");
router.delete("/notification/:id");

module.exports = router