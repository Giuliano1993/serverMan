import inquirer from "inquirer";
import init from "../../init.js";
import ProjectList from "./ProjectList.js";
import AddProject from "./AddProject.js";

const VercelCommands = function(){
    inquirer.prompt([{
        type:"list",
        name:"command",
        message: "What do you want to do?",
        choices: [
            "Projects list",
            "New Project",
            "Back",
            "Exit"
        ]
    }]).then(answers=>{
        switch (answers.command) {
            case "Projects list":
                ProjectList();
                break;
            case "New Project":
                AddProject();
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

export default VercelCommands;