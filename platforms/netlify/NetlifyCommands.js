import inquirer from "inquirer";

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
    })
}

export default NetlifyCommands;