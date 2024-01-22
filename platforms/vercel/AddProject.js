import { timeStamp } from "console";
import { configDotenv } from "dotenv";

configDotenv();

export default async function AddProject() {
    const {vercelToken} = process.env;
    const projName = "my-project-ssss";
    const body = {
        "name": projName,
        "gitRepository": {
            "type": "github",
            "repo": "Giuliano1993/vue-the-menue"
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
        "files":[]
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