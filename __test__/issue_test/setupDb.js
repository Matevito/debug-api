const Project = require("../../models/project");
const Issue = require("../../models/issue")
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
const getIssues = async(project) => {
    const projectId = project._id
    const issuesForm = [
        {
            title: "issue 1",
            description: "an example of a description",
            project: projectId,
            status: "open",
            priority: "mid",
            type: "feature req",
            screenshots: []
        },
        {
            title: "issue 2",
            description: "a description....",
            project: projectId,
            status: "open",
            priority: "high",
            type: "bugg-error",
            screenshots: []
        },
        {
            title: "issue 3",
            description: "tests team functionalities...",
            project: projectId,
            status: "in progress",
            priority: "high",
            type: "feature req",
            handlingTeam: [project.team[1]],
            screenshots: []
        }
    ];
    const issuesObj = []
    issuesForm.forEach(async (form) => {
        const new_issue = new Issue(form);
        issuesObj.push(new_issue)
        //await new_issue.save()
    })

    return issuesObj
}
exports.getData =  async () => {
    const user_list = await userList()
    const savedUsers = await saveUsers(user_list);
    const project = await getProject(savedUsers);
    const tokenList = getTokens(savedUsers);
    
    const issuesList = await getIssues(project)
    
    return {
        usersList: savedUsers,
        project: project,
        tokenList: tokenList,
        issues: issuesList
    };

}