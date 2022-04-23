const multer = require("multer");
const path = require("path");

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(null, false)
    }
}

module.exports = multer({
    storage: multer.diskStorage({}),
    limits: {
        fileSize: 1024*1024*5 // 5mbs
    },
    fileFilter: fileFilter
});