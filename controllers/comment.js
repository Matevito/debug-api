const Issue = require("../models/issue");
const Comment = require("../models/comment")

const { body, validationResult } = require("express-validator");

exports.comment_post = async(req, res) => {
    const issue = await Issue.findById(req.issue);
    if (!issue) {
        return res.status(400).json({
            error: "issue not found on db"
        })
    };
    const screenshots = [];
    //todo ... handle screenshots

    // build comment obj
    const new_comment = new Comment({
        issue: issue._id,
        user: req.user.id,
        message: req.body.message,
        screenshots: screenshots
    })
    
    //attempt to save comment and send response
    try {
        await new_comment.save();
        res.json({
            error: null,
            msg: "Comment saved successfully"
        })
    } catch (err) {
        res.status(400).json({
            error: "error saving data on db",
            msg: err
        })
    }
}