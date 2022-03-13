const setUser = (req, res, next) => {
    if (req.body) {
        req.user = req.body;
        next();
    } else {
        res.status(500).json({
            error: "problem with send data"
        })
    }
}

module.exports = setUser;