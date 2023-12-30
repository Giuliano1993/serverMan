import inquirer from "inquirer";
import {createSite} from "./createSite.js";

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
        console.log(answers.command)
        switch (answers.command) {
            case "Create Site":
                createSite();
                break;
        
            default:
                break;
        }
    })
}

export default NetlifyCommands;