import { NodeSSH } from "node-ssh";import { stdout } from "process";
import { getDroplets } from "./utilities.js";
import inquirer from "inquirer";
import { spawn } from "child_process";
const createSiteCommand = async ()=>{
   
    const droplets = await getDroplets();

    inquirer.prompt([{
        type: "list",
        name: "droplet",
        message: "Pick a droplet",
        choices: droplets.map((d)=>d.name)
    }]).then((answers)=>{
        const droplet = droplets.find(d=>d.name === answers.droplet)
        const {ip_address} = droplet['networks']['v4'].find(ip=>ip.type === "public");
        createSite(ip_address);
        //spawn("ssh",['-t',`-i ${process.env.localKeyFile}`, `root@${ip_address}`],{stdio:'inherit'})
    })

}
export default createSiteCommand;

function createSite(ip_address){
    inquirer.prompt([
        {
            type:"text",
            name:"siteName",
            message:"Write a name for your site",
        },
        {
            type:"text",
            name:"folderName",
            message:"choose a folder name, [if you wish it different from your site name]",
        },
        {
            type:"confirm",
            name:"gitRepo",
            message:"choose a folder name, [if you wish it different from your site name]",
            default:true
        }
    ]).then((answers)=>{

        const siteName = answers.siteName.replace(' ','-')
        const folderName = answers.siteName.replace(' ','-')
    })
}