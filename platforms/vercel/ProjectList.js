import { configDotenv } from "dotenv"
import inquirer from "inquirer";
import open from "open";

configDotenv()
export default async function ProjectList() {
    const {vercelToken} = process.env;
    const sites = await fetch("https://api.vercel.com/v9/projects", {
      "headers": {
        "Authorization": `Bearer ${vercelToken}`
      },
      "method": "get"
    }).then(response => response.json())
    .then(data => {
      return data.projects
    })        
    console.log(sites);
 
    const project = await inquirer.prompt([{
      type:"list",
      name:"project",
      message: "Select a project",
      choices: sites.map(site => site.name)
    }]).then(answers => answers.project).then(project => sites.find(site => site.name === project))



    const functions = [
      "Open in browser",
      "Show informations",
      "Delete"
    ]

    const action = await inquirer.prompt([{
      type:"list",
      name:"action",
      message: "What do you want to do?",
      choices: functions
    }]).then(answers => answers.action)

    
    switch(action) {
      case "Open in browser":
        const url = project?.targets?.production?.url
        console.log(`Opening ${url}`)
        open("http://"+url);
        break;
      case "Show informations":
        console.log(project)
        break;
      case "Delete":
        console.log("Deleting")
        break;
    }


}