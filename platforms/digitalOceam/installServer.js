import { NodeSSH } from "node-ssh";import { stdout } from "process";
import { getDroplets } from "./utilities.js";
import inquirer from "inquirer";
const installServerCommand = async ()=>{
   
    const droplets = await getDroplets();

    inquirer.prompt([{
        type: "list",
        name: "droplet",
        message: "Pick a droplet",
        choices: droplets.map((d)=>d.name)
    }]).then((answers)=>{
        const droplet = droplets.find(d=>d.name === answers.droplet)
        const {ip_address} = droplet['networks']['v4'].find(ip=>ip.type === "public");
        installServer(ip_address);
        //spawn("ssh",['-t',`-i ${process.env.localKeyFile}`, `root@${ip_address}`],{stdio:'inherit'})
        

    })

}

export default installServerCommand



async function installServer(ipAddress){

    const ssh = new NodeSSH();
    ssh.connect({
        host: ipAddress,
        username: 'root',
        privateKeyPath: process.env.localKeyFile,
        tryKeyboard:true

    }).then(()=>{
        ssh.execCommand('whoami').then(function(result) {
            console.log('STDOUT: ' + result.stdout)
            console.log('STDERR: ' + result.stderr)
        })
        ssh.execCommand('apt-get update')
            .then((res)=>{
                console.log(res.stdout)
                return ssh.execCommand("apt-get install -y apache2")}
            )
            .then((res)=>{
                console.log(res.stdout)
                return ssh.execCommand("apt-get install -y php libapache2-mod-php")
            })
            .then((res)=>{
                console.log(res.stdout)
                return ssh.execCommand("systemctl restart apache2")
            })
            .then((res)=>{
                console.log(res.stdout)
                return ssh.execCommand("php -r \"copy('https://getcomposer.org/installer', 'composer-setup.php');\"")
            })
            .then((res)=>{
                console.log(res.stdout)
                return ssh.execCommand("php composer-setup.php --install-dir=/usr/local/bin --filename=composer")
            })
            .then((res)=>{
                console.log(res.stdout)
                return ssh.execCommand("php -r \"unlink('composer-setup.php');\"")
            })
            .then((res)=>{
                console.log(res.stdout)
                return ssh.execCommand("apt-get install -y git")
            }).finally(()=>{
                console.log('installato tutto')
            })

        const commands = [
            "apt-get update",
            "apt-get install -y apache2",
            "apt-get install -y php libapache2-mod-php",
            "systemctl restart apache2",
            "php -r \"copy('https://getcomposer.org/installer', 'composer-setup.php');\"",
            "php composer-setup.php --install-dir=/usr/local/bin --filename=composer",
            "php -r \"unlink('composer-setup.php');\"",
            "apt-get install -y git",
        ]
        
        //return execCommands(commands)
        
        
    })
    .catch((error)=>{
        console.log(error)
        return ssh.connect({
            host: ip_address,
            username: 'root',
            privateKeyPath: process.env.localKeyFile,
            tryKeyboard:true
    
        })
    }).then(()=>{
        ssh.execCommand('ls').then(function(result) {
            console.log('STDOUT: ' + result.stdout)
            console.log('STDERR: ' + result.stderr)
        })
    })
}