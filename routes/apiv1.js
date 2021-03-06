const express = require("express");
const router = express.Router();

// controllers
const authCont = require("../controllers/auth");
const demoCont = require("../controllers/demo");
const proyCont = require("../controllers/project");
const issueCont = require("../controllers/issue");
const commentCont = require("../controllers/comment");
const userCont = require("../controllers/user");
const notCont = require("../controllers/notification");

// middlewares
const validateToken = require("../dependencies/middlewares/validateToken");
    // all middlewares require user { _id, username, role}
const upload = require("../dependencies/middlewares/multer");

// protection on routes.
const adminOnly = require("../dependencies/middlewares/adminOnly");
const admin_teamL = require("../dependencies/middlewares/admin_teamL");
const inProject = require("../dependencies/middlewares/inProject");
const setIssueValues = require("../dependencies/middlewares/setIssueValues");
    // sanitize forms
const sanitizeProject = require("../dependencies/middlewares/sanitizeProject");
    
// 1. auth routes
router.post("/sign-in", authCont.signin_post);
router.post("/log-in", authCont.login_post);
router.get("/whoami", validateToken, authCont.whoami_get);

// 1.5 demo auth routes
router.post("/demo/admin", demoCont.login_admmin, authCont.login_post);
router.post("/demo/teamLeader", demoCont.login_teamL, authCont.login_post);
router.post("/demo/developer", demoCont.login_dev, authCont.login_post);

// ┬íProtected routes!
    // all the following routes are protected.
router.use(validateToken);

// 2. project routes
router.post("/project", adminOnly, sanitizeProject, proyCont.project_post);

router.put("/project/:id", admin_teamL, sanitizeProject, proyCont.project_put);
router.delete("/project/:id", adminOnly, proyCont.project_delete)

router.get("/project/list", proyCont.projectList_get);
router.get("/project/:id", inProject, proyCont.project_get);

// 3. Issues routes.
router.post("/project/:id/issue", inProject, upload.array('screenshots', 5), issueCont.issue_post);
router.get("/project/:id/issue/list", inProject, issueCont.issueList_get);

router.get("/issue/:id", setIssueValues, inProject, issueCont.issue_get);
router.put("/issue/:id/take-issue", setIssueValues, inProject, issueCont.takeIssue_put);
router.put("/issue/:id/leave-issue", setIssueValues, inProject, issueCont.leaveIssue_put);
router.put("/issue/:id", setIssueValues, inProject, issueCont.issue_put);

router.delete("/issue/:id", setIssueValues, adminOnly ,issueCont.issue_delete);

// 3.1 Comments routes
//  router.get("/issue/:id/comment/list")

router.post("/issue/:id/comment", setIssueValues, inProject, upload.array('screenshots', 5), commentCont.comment_post)

// 4. User routes
router.get("/user/list", userCont.userList_get);
router.get("/user/:id", userCont.user_get);
    // edit user data - only for admins
    // /user/:ID/status ? only for admins?
router.put("/user/:id/make-admin", adminOnly, userCont.userToAdmin_put);

// todo: other type of callbacks
router.get("/notification/list", notCont.notificationList_get);
router.delete("/notification/:id", notCont.notification_delete);

module.exports = router