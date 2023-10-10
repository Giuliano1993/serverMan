import inquirer from "inquirer";

const DigitalOceansCommands = function(){
    inquirer.prompt([{
        type:"list",
        name:"command",
        message: "What do you want to do?",
        choices:[
            'Create Server',
            'Connect to server with SSH',
            'Setup Website on a server',
            "Back",
            'Exit'
        ]
    }]).then(answers=>{
        console.log(answers.command)
    })
}

export default DigitalOceansCommands;