const express = require("express");
const router = express.Router();

// controllers
const authCont = require("../controllers/auth");
const demoCont = require("../controllers/demo");
const proyCont = require("../controllers/proyect");

// middlewares
const validateToken = require("../dependencies/middlewares/validateToken");
    //... rest of middlewares ... all middlewares require user { _id, username, role}
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
router.use(validateToken);

// 2. Proyect routes
router.post("/proyect", proyCont.proyect_post);
router.put("/proyect/:id", proyCont.proyect_put);
router.delete("/proyect/:id", proyCont.proyect_delete)

router.get("/proyect/list", proyCont.proyectList_get);
router.get("/proyect/:id", proyCont.proyect_get);

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
    // edit user data - only for admins
router.put("/user/:id");

// todo: other type of callbacks
router.get("/notification/list");
router.delete("/notification/:id");

module.exports = router