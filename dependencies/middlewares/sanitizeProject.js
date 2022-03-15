const { body, validationResult } = require("express-validator");
const User = require("../../models/user");
const isValidId = require("../isValidId");

const sanitizeProject = [
    body("title", "A title for the project is required").trim().escape(),
    body("description", "A description is required").trim().escape(),
    body("team.*").custom(async(team_member, { req }) => {
        let team_list = req.body.team;

        // members do not repeat
        let counting_team = [];
        team_list.forEach(member => {
            if (counting_team.includes(member)){
                throw new Error("Some team members repeat")
            }
            counting_team.push(member);
        });

        // team members are on db
        if (!isValidId(team_member)) {
            throw new Error("User id is corrupted")
        };
        let found_user = await User.findById(team_member);
        if (!found_user) {
            throw new Error("User is not on db")
        }

        // the id value is fine, continue
        return true;
    }).escape(),
    body("teamLeader").custom((teamLeader, { req }) => {
        // leader is on team member list
        const team_list = req.body.team;
        if (!team_list.includes(teamLeader)) {
            // if is not on the list...
            throw new Error("team leader is not in the team list")
        };
        // value is not null
        return true;
    }).escape(),
    (req, res, next) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                msg: "Error with parsed form data",
                error: errors.array()
            })
        };
        // parsed data is valid, continue
        next();
    }
]

module.exports = sanitizeProject;