import inquirer from "inquirer";
import {createSite} from "./createSite.js";
import init from "../../index.js";

const NetlifyCommands = function(){
    inquirer.prompt([{
        type:"list",
        name:"command",
        message: "What do you want to do?",
        choices: [
            "Create Site",
            "List Sites",
            "Back",
            "Exit"
        ]
    }]).then(answers=>{
        switch (answers.command) {
            case "Create Site":
                createSite();
                break;
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

export default NetlifyCommands;