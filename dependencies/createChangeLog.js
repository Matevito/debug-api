const ChangeLog = require("../models/changeLog");

const createChanges = (oldObj, newObj) => {
    const changes = [];
    
    if (oldObj.description !== newObj.description) {
        const change = {
            property: "description",
            oldValue: oldObj.description,
            newValue: newObj.description
        };
        changes.push(change)
    };
    if (oldObj.status !== newObj.status) {
        const change = {
            property: "status",
            oldValue: oldObj.status,
            newValue: newObj.status
        };
        changes.push(change)
    };
    if (oldObj.priority !== newObj.priority) {
        const change = {
            property: "priority",
            oldValue: oldObj.priority,
            newValue: newObj.priority
        };
        changes.push(change)
    };
    if (oldObj.type !== newObj.type) {
        const change = {
            property: "type",
            oldValue: oldObj.type,
            newValue: newObj.type
        };
        changes.push(change)
    };
    //compare array
    const oldTeam = oldObj.handlingTeam.sort().toString();
    const newTeam = newObj.handlingTeam.sort().toString();
    if (oldTeam !== newTeam) {
        const change = {
            property: "handlingTeam",
            oldValue: oldObj.handlingTeam,
            newValue: newObj.handlingTeam
        };
        changes.push(change)
    };
    return changes;
}

const createChangeLog = (oldObj, newObj) => {
    const changes = createChanges(oldObj, newObj);
    if (changes.length === 0) { 
        return false
    };
    changes.forEach(async(changeLog) => {
        const new_changeLog = new ChangeLog({
            issue: oldObj._id,
            property: changeLog.property,
            oldValue: changeLog.oldValue,
            newValue: changeLog.newValue,
        });
        const saved_changeLog = await new_changeLog.save();
        if (!saved_changeLog){
            return false
        };
    })
    return true
};

module.exports = createChangeLog