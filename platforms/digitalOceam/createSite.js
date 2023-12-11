import { NodeSSH } from "node-ssh";import { stdout } from "process";
import { getDroplets } from "./utilities.js";
import inquirer from "inquirer";
import { spawn } from "child_process";
import { getConfig } from "./utilities.js";
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
            message:"Do you want to clone a github repo?",
            default:true
        }
    ]).then(async (answers)=>{

        const siteName = answers.siteName.replace(' ','-')
        const folderName = answers.folderName !== '' ? answers.folderName.replace(' ','-') : answers.siteName.replace(' ','-')
        const gitRepo = answers.gitRepo

        if(gitRepo){
            const user = getConfig('gitUser');
            const token = getConfig('gitToken');
            const questions = [
                {
                    type:'text',
                    name: 'repoName',
                    message: 'type your repository name'
                }
            ];
            if(user === '' || typeof user === 'undefined'){
                questions.push({
                    type: 'text',
                    name: 'gitUser',
                    text: "Type your github username"
                })
            }
            if(token === '' || typeof token === 'undefined'){
                questions.push({
                    type: 'text',
                    name: 'gitToken',
                    text: "Type your github token [ It won't be saved ]"
                })
            }

            const gitCredentials = await inquirer.prompt(questions)
                .then((answers)=>{
                    const {repoName} = answers;
                    const user = user || answers.gitUser;
                    const token = token || answers.gitToken;

                    return {
                        repoName : repoName,
                        gitUser : user,
                        gitToken : token
                    }
                })
        }

        const ssh = new NodeSSH();
        ssh.connect({
            host: ip_address,
            username: 'root',
            privateKeyPath: process.env.localKeyFile,
            tryKeyboard:true
        }).then(()=>{
            return ssh.execCommand(`cd /var/www; mkdir ${folderName}; cd ${folderName}; pwd`)
        }).then((res)=>{
            console.log(res.stdout);
            if(gitRepo){
                const { repoName, gitUser, gitToken } = gitCredentials;
                return ssh.execCommand(`cd /var/www/${folderName}; git clone https://${gitUser}:${gitToken}@github.com/${gitUser}/${repoName}.git .`)
            }else{
                return ssh.execCommand(`cd /var/www/${folderName}; touch ./index.html; echo -e "<h1>Hello World ${folderName}<h1>" >> ./index.html`)
            }
        }).then((res)=>{
            const confName = siteName.substring(0,siteName.indexOf('.')) + ".conf";
            return ssh.putFile('./configs/apache/defaultDomain.conf',`/etc/apache2/sites-available/${confName}`)
        }).then((res)=>{
            console.log('finito')
        }).catch((err)=>{
            console.error(err)
        })
    })
}