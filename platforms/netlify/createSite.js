import inquirer  from "inquirer";
import { chooseRepo, repoList, getDeployKey } from "../../utilities/gitUtilities.js";
import { configDotenv } from "dotenv";
import { time } from "console";
import { getNetlifyDeployKey, netlifyRequest, verifyNetlifyConfig } from "./utilities.js";



import * as path from "node:path";
import { fileURLToPath } from 'url';
import { setConfiguration, setConfigurationAsync  } from "../../utilities/makeConfigs.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
configDotenv({path: __dirname + '/../../.env'})
export const createSite = async function () {  
    if(!verifyNetlifyConfig()){
        console.log("You need to set your Netlify Token and Netlify username first");
        await setConfigurationAsync(["netlifyToken","netlifyUser"]);
        //process.exit(0);
    }
    
    const {githubInstallationId, netlifyUser} = process.env;
    
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
        try{

            const repo = await chooseRepo();   
            const pk = await getNetlifyDeployKey();
            let gitDeployKey = await getDeployKey(repo['name']);
            if(!gitDeployKey || getDeployKey.length === 0){
                console.log("No deploy key found for this repo. Creating one now.");
                gitDeployKey = await createDeployKey(repo['name'])
            }else{
                gitDeployKey = gitDeployKey[0]
            }
        }catch(err){
            if(err.status && err.status === 401){
                console.log("Wrong credentials for Netlify or Github. Please update them in your configuration");
                await setConfigurationAsync(["netlifyToken","netlifyUser","gitToken","gitUser","githubInstallationId"]);
            }

        }
        const cmd = await inquirer.prompt([
            {
                type: "input",
                name: "cmd",
                message: "What command should be run to build the site?",
                default: "npm run build"                
            }
        ])
        payload['repo'] = {
            "branch": repo['default_branch'],
            "cmd": cmd,
            "deploy_key_id": gitDeployKey['id'],
            "dir": "dist/",
            "private": false,
            "provider": "github",
            "repo": repo['full_name'],
            "repo_id": repo['id'],
            "installation_id": githubInstallationId
        }
        payload["build_settings"] = payload['repo']
            
    }
    try {
        netlifyRequest(`/api/v1/${netlifyUser}/sites`,payload).then((res)=>{
            console.log("Site created")
            
        }).catch((err)=>{
            console.log("Error creating site");
            console.log(err);
        })
    } catch (error) {
        console.log("Error creating site");
        console.log(error);
    }
};