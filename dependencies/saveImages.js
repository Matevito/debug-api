const cloudinary = require("./middlewares/cloudinary");

const saveImages = async(files) => {
    if (!files) {
        return []
    } else {
        const savedImages = await Promise.all(
            files.map(async(file) => {
                const result = await cloudinary.uploader.upload(file.path);
                return result.secure_url
            })
        );
        return savedImages
    }
};

module.exports = saveImages;