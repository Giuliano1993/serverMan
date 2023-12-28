import { inquirer } from "inquirer";
import { chooseRepo, repoList } from "../../gitUtilities";
import { configDotenv } from "dotenv";
import { time } from "console";


configDotenv();

const createSite = async function () {
    /*repos = await repoList();
    const repoChoices = repos.map(repo => repo['name']);*/
    
    const {githubTestInstallationId,netlifyToken, netlifyUser} = process.env;

    const sitename = time.now() + "site";

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
        chooseRepo();
    }
};