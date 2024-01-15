import inquirer from "inquirer";
import setupServer from "./setupServer.js";
import connectToServer from "./connectToServer.js";
import installServerCommand from "./installServer.js";
import createSiteCommand from "./createSite.js";
import { execSync } from "child_process";
import init from "../../init.js";


const DigitalOceansCommands = function(){
    inquirer.prompt([{
        type:"list",
        name:"command",
        message: "What do you want to do?",
        choices:[
            'Create Server',
            'Connect to server with SSH',
            'Install an initialized server',
            "Add website to server",
            "Back",
            'Exit'
        ]
    }]).then(answers=>{
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
            case "Add website to server":
                createSiteCommand()
                break
            case "Back":
                init();
                break;
            case "Exit":
                process.exit(0)
                break;
            default:
                break;
        }
    })
}

export default DigitalOceansCommands;