import { type } from "os";
import { getSizes, getDistributions, createDroplet, getDroplet } from "./utilities.js";
import inquirer from "inquirer";

const setupServer = async ()=>{
    
    const sizes = await getSizes()

    const sizeChoices = sizes.map((s)=>`RAM: ${s['memory']}, CPUs: ${s['vcpus']}, disk: ${s['disk']}GB `)
    const images = await getDistributions();
    const imageChoices = images.map((i)=>i['description'])
    
    inquirer.prompt([
        {
            type:"input",
            name:"machineName",
            message: "Pick a name for your machine"
        },
        {
            type: "list",
            name: "dropletSize",
            message: "what size do you need?",
            choices:sizeChoices
        },
        {
            type: "list",
            name: "dropletImage",
            message: "what OS do you prefer?",
            choices:imageChoices
        }
    ]).then((answers)=>{
        const machineName = answers['machineName'];
        
        const sizeIndex = sizeChoices.indexOf(answers['dropletSize']);
        const dropletSize = sizes[sizeIndex]['slug'];
    
        const imageIndex = imageChoices.indexOf(answers['dropletImage']);
        const dropletImage = images[imageIndex]['id'];
    
        createDroplet(machineName,dropletSize,dropletImage).then(async (res)=>{
            console.log(res)
            const {id} = res
            let droplet = await getDroplet(id);
            const dropletInterval = setInterval(async ()=>{
                droplet = await getDroplet(id)
                if(droplet['status'] === 'active'){
                    clearInterval(dropletInterval);
                    sshInstall(droplet)
                }
            },1000)
            
        }).catch(err=>{console.error(err)})
    })
}



const sshInstall = (droplet)=>{
    console.log("Droplet ready")
    console.log(droplet)
}

export default setupServer