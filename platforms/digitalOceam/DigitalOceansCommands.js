import inquirer from "inquirer";
import setupServer from "./setupServer.js";
import connectToServer from "./connectToServer.js";
import installServerCommand from "./installServer.js";



const DigitalOceansCommands = function(){
    inquirer.prompt([{
        type:"list",
        name:"command",
        message: "What do you want to do?",
        choices:[
            'Create Server',
            'Connect to server with SSH',
            'Install an initialized server',
            'Setup Website on a server',
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
            default:
                break;
        }
    })
}

export default DigitalOceansCommands;