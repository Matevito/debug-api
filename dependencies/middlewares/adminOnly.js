const adminOnly = (req, res, next) => {
    // req.user = { id, username, role}
    if (req.user.role !== "Admin") {
        return res.status(401).json({
            error: "Access denied"
        })
    }
    next();
}; 

module.exports = adminOnly;