import inquirer from "inquirer";
import setupServer from "./setupServer.js";
import connectToServer from "./connectToServer.js";
import installServerCommand from "./installServer.js";
import createSiteCommand from "./createSite.js";


const DigitalOceansCommands = function(){
    inquirer.prompt([{
        type:"list",
        name:"command",
        message: "What do you want to do?",
        choices:[
            'Create Server',
            'Connect to server with SSH',
            'Install an initialized server',
            "Init website on server",
            "Back",
            'Exit'
        ]
    }]).then(answers=>{
        console.log(answers.command)
        switch (answers.command) {
            case "Create Server":
                setupServer()
                break;
            case "Connect to server with SSH":
                connectToServer()
                break;
            case "Install an initialized server":
                installServerCommand()
                break;
            case "Init website on server":
                createSiteCommand()
                break
            default:
                break;
        }
    })
}

export default DigitalOceansCommands;