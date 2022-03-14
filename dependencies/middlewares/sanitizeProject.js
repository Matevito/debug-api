const { body, validationResult } = require("express-validator");
const User = require("../../models/user");

const sanitizeProject = [
    body("title", "A title for the project is required").trim().escape(),
    body("description", "A description is required").trim().escape(),
    body("team").custom(async(team_list) => {
        // team members are on db
        team_list.forEach(member_id => {
            const user = await User.findOne({ _id: member_id});
            if (!user) {
                throw new Error("some team members do not exist")
            }
        });
        // members do not repeat
        let counting_team = [];
        teal_list.forEach(member => {
            counting_team.push(member);
            if (counting_team.includes(member)){
                throw new Error("some team members repeat");
            }
        })
        
        return true;
    }).escape(),
    body("teamLeader").custom((teamLeader, { req }) => {
        // leader is on team member list
        const team_list = req.body.team;
        if (!team_list.includes(teamLeader)) {
            // if is not on the list...
            throw new Error("team leaderis not in the team list")
        };
        return true;
    }).escape(),
    (req, res, next) => {
        let errors = validationResult(req);
        if (!errors.isEmpty) {
            return res.status(400).json({
                msg: "Error with parsed form data",
                error: errors.array()
            })
        };
        // parsed data is valid, continue
        next();
    }
]

module.exports = sanitizeP;