import inquirer from "inquirer";

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
        console.log(answers.command)
    })
}

export default VercelCommands;