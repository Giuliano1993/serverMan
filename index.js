import inquirer from "inquirer";
import  DigitalOceansCommands  from "./platforms/digitalOceam/DigitalOceansCommands.js";
import  NetlifyCommands  from "./platforms/netlify/NetlifyCommands.js";
import  VercelCommands  from "./platforms/vercel/VercelCommands.js";
export default function init(){
  inquirer
    .prompt([
      {
        type:"list",
        name:"platform",
        message: "Choose a platform",
        choices: ["DigitalOcean", "Netlify","Vercel"]
      }
    ])
    .then(answers => {
      console.info('Answer:', answers.faveReptile);
      console.log(answers.platform)
      switch (answers.platform) {
        case "DigitalOcean":
          DigitalOceansCommands()
          break;
        case "Netlify":
          NetlifyCommands()
          break;
        case "Vercel":
          VercelCommands()
          break;
      
        default:
          break;
      }
    });
}

init();
