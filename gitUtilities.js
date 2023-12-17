import { configDotenv } from "dotenv"

configDotenv()
const API_BASE_URL = "https://api.github.com/users/";

export const repoList = async ()=>{
    const user = process.env.githubUser;
    const gitToken = process.env.gitToken;
    const url = API_BASE_URL + `users/${user}/repos?per_page=100`;

    return await fetch(url,{
        headers: {
            "Accept":"application/vnd.github+json",
            "Authorization": `Bearer ${gitToken}`,
            "X-GitHub-Api-Version": "2022-11-28"
        }
    }).then(res=>res.json())
}


export const chooseRepo = async ()=>{
    const repos = await repoList();
    const repoChoices = repos.map(repo=>repo['name']);
    return await inquirer.prompt([{
        type: "list",
        name: "repo",
        message: "Choose a repo",
        choices: repoChoices
    }]).then(answers=>answers.repo);
}