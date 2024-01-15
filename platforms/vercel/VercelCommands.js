import inquirer from "inquirer";
import init from "../../init.js";

const VercelCommands = function(){
    inquirer.prompt([{
        type:"list",
        name:"command",
        message: "What do you want to do?",
        choices: [
            "Back",
            "Exit"
        ]
    }]).then(answers=>{
        switch (answers.command) {
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

export default VercelCommands;