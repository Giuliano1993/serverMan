import { configDotenv } from "dotenv";
import * as path from "node:path";
import { fileURLToPath } from 'url';
import { netlifyRequest } from "./utilities.js";
import inquirer from "inquirer";
import open from "open";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
configDotenv({path: __dirname + '/../../.env'});
const listSites = async ()=>{
    
  const sites = await netlifyRequest("/api/v1/sites",null, "application/json", "GET");
    //console.log(sites);

    const site = await inquirer.prompt([{
        type:"list",
        name:"site",
        message: "Choose a site",
        choices: sites.map(site=>site.name)
    }])
    .then(answers=> answers.site)
    .then(siteName=>sites.find((s)=>s.name === siteName))
    ;


    const actions = [
        "Open in browser",
        "Delete"
    ];

    const action = await inquirer.prompt([{
        type:"list",
        name:"action",
        message: "What do you want to do?",
        choices: actions
    }]).then(answers => answers.action);

    switch(action){
        case "Open in browser":
            const url = site?.url;
            console.log(`Opening ${url}`);
            open("http://"+url);
            break;
        case "Delete":
            deleteSite(site);
            break;
    }

    
}


const deleteSite = async (site) =>{

    inquirer.prompt([{
        type:"confirm",
        name:"confirm",
        message: "Are you sure you want to delete this site?",
        default: false
    },{
        type:"input",
        name:"siteName",
        message: "Type the name of the site to confirm",
        when: (answers)=>answers.confirm
    }]).then((answers)=>{
        if(answers.confirm && answers.siteName === site.name){
            const {netlifyToken, netlifyUser} = process.env;
            const netlifyAPI = "https://api.netlify.com";
            const url = `/api/v1/sites/${site.id}`
             fetch(netlifyAPI + url,{
                method,
                headers: {
                    "Authorization": `Bearer ${netlifyToken}`,
                    "Content-Type": contentType
                },
                body: JSON.stringify(body)
            }).then((res)=>{
                if(res.status === 204){
                    console.log("Site deleted");
                }}
            );
        }
    })

    
}
export default listSites;