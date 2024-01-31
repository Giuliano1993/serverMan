import { configDotenv } from "dotenv"
import inquirer from "inquirer";
import * as path from "node:path";
import open from "open";

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
configDotenv({path: __dirname + '/../../.env'})
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
      /*case "Show informations":
        console.log(project)
        break;*/
      case "Delete":
        deleteApp(project)
        break;
    }


}

const deleteApp = async (project) => {
  
  const {vercelToken} = process.env;
  const deleteQuestions = [
    {
      type: "confirm",
      name: "confirm",
      message: `Are you sure you want to delete ${project.name}?`
    },
    {
      type: "input",
      name: "name",
      message: `Please type the name of the project to confirm`,
      when: (answers) => answers.confirm
    }
  ];

  const confirmDelete = await inquirer.prompt(deleteQuestions).then((answers) => answers.confirm && answers.name === project.name);

  if(confirmDelete) {

    await fetch(`https://api.vercel.com/v9/projects/${project.id}`, {
      "headers": {
        "Authorization": `Bearer ${vercelToken}`
      },
      "method": "delete"
    }).then((response) => { if(response.status === 204){
      console.log("Project deleted")
    }})
  }
}