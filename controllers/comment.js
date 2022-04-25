const Issue = require("../models/issue");
const Comment = require("../models/comment")

const { body, validationResult } = require("express-validator");
const saveImage = require("../dependencies/saveImages");
const saveImages = require("../dependencies/saveImages");

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
        const files = req.files;
        const screenshots = await saveImages(files);
    
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
            const commentList = await Comment.find({ issue: issue._id }).populate({path:"user", select:"username"});
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