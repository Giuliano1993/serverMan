import { exec } from "child_process";
import { configDotenv } from "dotenv"
import * as fs from "fs";
import inquirer from "inquirer";

configDotenv({path: __dirname + '/../.env'})
const API_BASE_URL = "https://api.github.com/";

export const repoList = async ()=>{
    const user = process.env.gitUser;
    const gitToken = process.env.gitToken;
    const url = API_BASE_URL + `users/${user}/repos?per_page=100`;

    return await fetch(url,{
        headers: {
            "Accept":"application/vnd.github+json",
            "Authorization": `Bearer ${gitToken}`,
            "X-GitHub-Api-Version": "2022-11-28"
        }
    }).then(res=>res.json());
}


export const chooseRepo = async ()=>{
    
    const repos = await repoList();
    const repoChoices = repos.map(repo=>repo['full_name']);
    return await inquirer.prompt([{
        type: "list",
        name: "repo",
        message: "Choose a repo",
        choices: repoChoices
    }]).then(answers=>{
        return repos.find(repo=>repo['full_name'] === answers.repo)
    });
}

export const getDeployKey = async (repo)=>{
    const {gitUser,gitToken} = process.env;
    const url = API_BASE_URL + `repos/${gitUser}/${repo}/keys`;
    console.log(url)
    return await fetch(url,{
        headers: {
            "Accept":"application/vnd.github+json",
            "Authorization": `Bearer ${gitToken}`,
            "X-GitHub-Api-Version": "2022-11-28"
        }
    }).then(res=>res.json())
}


export const createDeployKey = async (repo)=>{
    const {gitUser,gitToken, userMail} = process.env;
    const mailParam = userMail ? `-C ${userMail}` : "";
    const homeDir = os.homedir();
    const sshDir = homeDir + "/.ssh";

    //ask the userfor a key name
    const keyName = await inquirer.prompt([{
        type: "input",
        name: "keyName",
        message: "Enter a name for the key"
    }]).then(answers=>answers.keyName);

    const keyNamePath = sshDir + "/git_generated" + keyName;
    //exec(`ssh-keygen -t rsa -b 4096 -f ${keyNamePath} ${mailParam} -q -N ""`,(err,stdout,stderr)=>{})
    const created = await execShellCommandAsync(`ssh-keygen -q -t ed25519 -N "" -f ${keyNamePath} ${mailParam}`)
    //exec(`ssh-keygen -q -t ed25519 -N "" -f ${keyNamePath} ${mailParam}`)
    if(created){
        let key;
        fs.readFileSync(keyNamePath, 'utf8', (err, data) => {
            if (err) throw err;
            key = data;
        })
        const url = API_BASE_URL + `repos/${gitUser}/${repo}/keys`;
        data = {
            title: keyName,
            key: key,
            read_only: true
        }

        return fetch(url,{
            headers:{
                "Accept":"application/vnd.github+json",
                "Authorization": `Bearer ${gitToken}`,
                "X-GitHub-Api-Version": "2022-11-28"
            },
            body: JSON.stringify(data)
        }).then(res=>res.json())
    }
    return false



}




function execShellCommandAsync(cmd) {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
     exec(cmd, (error, stdout, stderr) => {
      if (error) {
       console.warn(error);
      }
      resolve(stdout? stdout : stderr);
     });
    });
   }