import { timeStamp } from "console";
import { configDotenv } from "dotenv";
import { chooseRepo } from "../../utilities/gitUtilities.js";
import inquirer from "inquirer";

configDotenv({path: __dirname + '/../../.env'})

export default async function AddProject() {
    const {vercelToken} = process.env;
    const projName = await inquirer.prompt({
        type: "input",
        name: "projName",
        message: "Choose your project name?"
    }).then(answers => answers.projName);
    const repo = await chooseRepo();
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
    if(res.error){
        console.log(res.error.message);
        return;
    }
    const deploymentBody = {
        "name": "my-deployment",
        "project":  projName,
        "gitSource":{
            "ref": "main",
            "type": "github",
            "repoId": repo.id
        }
    };
    await fetch(`https://api.vercel.com/v13/deployments`, {
        "headers": {
            "Authorization": `Bearer ${vercelToken}`
        },
        "method": "POST",
        "body": JSON.stringify(deploymentBody)
    }).then(response => response.json())
    .then(data=>{
        if(data.error){
            console.log(data.error.message);
            return;
        }
        console.log("Project created");
        //console.log(data);
        console.log(`Check your deployment status at ${data.inspectorUrl}`)
    }).catch(err=>{
        console.log(err);
    });
    

}