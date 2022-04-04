const Issue = require("../models/issue");
const Comment = require("../models/comment")

const { body, validationResult } = require("express-validator");

exports.comment_post = [
    body("message", "a message for the comment is required").trim().isLength({ min:1, max:500}).escape(),
    async(req, res) => {
        // validate form data
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({
                msg: "error with parsed form data",
                error: errors.array()
            })
        };

        // data needed for comment obj
        const issue = await Issue.findById(req.issue);
        if (!issue) {
            return res.status(400).json({
                error: "issue not found on db"
            })
        };
        // handle screenshots array
        const screenshots = [];
        if (req.files) {
            const files = req.files;
            files.forEach((file) => {
                const path = file.path;
                screenshots.push(path)
            })
        };
    
        // build comment obj
        const new_comment = new Comment({
            issue: issue._id,
            user: req.user.id,
            message: req.body.message,
            screenshots: screenshots
        })
        
        //attempt to save comment and send response
        try {
            const savedComment = await new_comment.save();
            const commentList = await Comment.find({ issue: issue._id });
            res.json({
                error: null,
                msg: "Comment saved successfully",
                data: {
                    commentList,
                    savedComment
                }
            })
        } catch (err) {
            res.status(400).json({
                error: "error saving data on db",
                msg: err
            })
        }
    }
]