import inquirer  from "inquirer";
import { chooseRepo, repoList, getDeployKey } from "../../gitUtilities.js";
import { configDotenv } from "dotenv";
import { time } from "console";
import { getNetlifyDeployKey, netlifyRequest } from "./utilities.js";


configDotenv();

export const createSite = async function () {    
    const {githubTestInstallationId, netlifyUser} = process.env;
    
    const sitename = Date.now() + "site";

    let payload = {
        "name":sitename,
        "subdomain":sitename
    }

    const useRepo = await inquirer.prompt([{
        type : "confirm",
        name : "useRepo",
        message : "Do you want to link a repo to this site?",
        default : true
    }]).then(answers=>answers.useRepo);

    if(useRepo){
        const repo = await chooseRepo();
        const pk = await getNetlifyDeployKey();
        let gitDeployKey = await getDeployKey(repo);
        console.log(gitDeployKey);
        if(!gitDeployKey || getDeployKey.length === 0){
            console.log("No deploy key found for this repo. Creating one now.");
            gitDeployKey = await createDeployKey(repo)
        }else{
            gitDeployKey = gitDeployKey[0]
        }

        payload['repo'] = {
            "branch": repo['default_branch'],
            "cmd": "npm run build",
            "deploy_key_id": gitDeployKey['id'],
            "dir": "dist/",
            "private": false,
            "provider": "github",
            "repo": repo['full_name'],
            "repo_id": repo['id'],
            "installation_id": githubTestInstallationId
        }
        payload["build_settings"] = payload['repo']
            
    }
    netlifyRequest(`/api/v1/${netlifyUser}/sites`,payload).then((res)=>{
        console.log(res);
    }).catch((err)=>{
        console.log(err);
    })
};