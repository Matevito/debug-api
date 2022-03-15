const idPattern = /^[a-fA-F0-9]{24}$/;

const isValidId = async (id) => {
    if (idPattern.test(id)){
        return true
    } else {
        return false
    }
};

module.exports = isValidId;