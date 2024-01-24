import { timeStamp } from "console";
import { configDotenv } from "dotenv";
import { chooseRepo } from "../../utilities/gitUtilities.js";

configDotenv();

export default async function AddProject() {
    const {vercelToken} = process.env;
    const projName = "my-project-ssas";
    const repo = await chooseRepo();
    console.log(repo);
    const body = {
        "name": projName,
        "gitRepository": {
            "type": "github",
            "repo": repo.full_name, 
        },
        "buildCommand": "npm run build",
    };
    const res = await fetch("https://api.vercel.com/v9/projects", {
        "headers": {
            "Authorization": `Bearer ${vercelToken}`
        },
        "method": "POST",
        "body": JSON.stringify(body)
    }).then(response => response.json());

    console.log(res);
    const deploymentBody = {
        "name": "my-deployment",
        "project":  projName,
        "gitSource":{
            "ref": "main",
            "type": "github",
            "repoId": repo.id
        }
    };
    const deployments = await fetch(`https://api.vercel.com/v13/deployments`, {
        "headers": {
            "Authorization": `Bearer ${vercelToken}`
        },
        "method": "POST",
        "body": JSON.stringify(deploymentBody)
    }).then(response => response.json());
    
    console.log(deployments);

}