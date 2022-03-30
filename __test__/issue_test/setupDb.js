const Project = require("../../models/project");
const get_token = require("../get_token");

const userList = require("../userList").get_users;

const saveUsers = async(users) => {
    let userList = [];
    users.forEach( async(userObj) => {
        const savedUser = await userObj.save();
        userList.push(savedUser)
    });
    return users
}

const getProject = async(users) => {
    const project = {
        title: "projecTest",
        description: "an example of a descripction",
        team: [ users[1]._id, users[2]._id, users[4]._id],
        teamLeader: users[4]._id
    }
    const projectObj = new Project(project);    
    const savedProject = await projectObj.save();
    return savedProject
}
const getTokens = (users) => {
    let tokenList = []
    users.forEach((user) => {
        const token = get_token(user);
        tokenList.push({
            token:token,
            username: user.username,
            role: user.role,
            id: user._id
        })
    })
    return tokenList

}
exports.getData =  async () => {
    const user_list = await userList()
    const savedUsers = await saveUsers(user_list);
    const project = await getProject(savedUsers);
    const tokenList = getTokens(savedUsers);
    //todo: create some test issues
    return {
        usersList: savedUsers,
        project: project,
        tokenList: tokenList
    };

}