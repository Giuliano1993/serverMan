import { NodeSSH } from "node-ssh";import { stdout } from "process";
import { getDroplets } from "./utilities.js";
import inquirer from "inquirer";
import { getConfig } from "./utilities.js";
import { chooseRepo } from "../../utilities/gitUtilities.js";
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

export function createSite(ip_address){
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
        let gitCredentials = {
            user: '',
            token: '',
            repo: ''
        }
        if(gitRepo){
            gitCredentials.user = getConfig('gitUser');
            gitCredentials.token = getConfig('gitToken');
            
            const repo = await chooseRepo();
            const user = gitCredentials.user || await inquirer.prompt({
                type: 'text',
                name: 'gitUser',
                text: "Type your github username"
            }).then((answers)=>answers.gitUser)
            const token = gitCredentials.token || await inquirer.prompt({
                type: 'text',
                name: 'gitToken',
                text: "Type your github token [ It won't be saved ]"
            }).then((answers)=>answers.gitToken)

            gitCredentials = {
                user:user,
                token:token,
                repo:repo
            }
        }
        const confName = siteName.substring(0,siteName.indexOf('.')) + ".conf";
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
                const { repo, user, token } = gitCredentials;
                return ssh.execCommand(`cd /var/www/${folderName}; git clone https://${user}:${token}@github.com/${user}/${repo['name']}.git .`)
            }else{
                return ssh.execCommand(`cd /var/www/${folderName}; touch ./index.html; echo -e "<h1>Hello World ${folderName}<h1>" >> ./index.html`)
            }
        }).then((res)=> ssh.putFile('./configs/apache/defaultDomain.conf',`/etc/apache2/sites-available/${confName}`))
        .then((res)=>  ssh.execCommand(`sed -i 's/SITEFOLDERNAME/${folderName}/g' /etc/apache2/sites-available/${confName}`) )
        .then((res)=>  ssh.execCommand(`a2ensite ${confName}`) )
        .then((res)=>  ssh.execCommand(`a2dissite 000-default.conf`) )
        .then((res)=>  ssh.execCommand(`apache2ctl configtest`) )
        .then((res)=>  ssh.execCommand(`systemctl restart apache2`) )
        .then((res)=>{
            console.log('Done!');
            process.exit();
        }).catch((err)=>{
            console.error(err)
        })
    })
}