import  inquirer  from "inquirer";
import { getDroplets } from "./utilities.js";
import { NodeSSH } from "node-ssh";


const connectToServer = async ()=>{

    const droplets = await getDroplets();

    inquirer.prompt([{
        type: "list",
        name: "droplet",
        message: "Pick a droplet",
        choices: droplets.map((d)=>d.name)
    }]).then((answers)=>{
        const droplet = droplets.find(d=>d.name === answers.droplet)
        const {ip_address} = droplet['networks']['v4'].find(ip=>ip.type === "public");
        console.log(ip_address)
        const ssh = new NodeSSH();
        ssh.connect({
            host: ip_address,
            username: 'root',
            privateKeyPath: process.env.localKeyFile
        }).then(()=>{
            ssh.execCommand('whoami').then((res)=>{
                console.log('STDOUT: ' + res.stdout)
                console.log('STDERR: ' + res.stderr)
                return ssh.execCommand('exit')
            }).then(()=>{
                console.log('Finito')
                process.exit()
            })
        })


    })

}

export default connectToServer