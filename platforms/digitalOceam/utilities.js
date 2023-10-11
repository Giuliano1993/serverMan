import { configDotenv } from "dotenv"
configDotenv()
const API_BASE_URL = "https://api.digitalocean.com/v2/"


const buildBasicHeaders = ()=>{
    const token = process.env.doAuthToken;
    return {
        'Content-Type':'application/json',
        'Authorization':'Bearer '+token
    }   
}

const createDroplet = (name, size, image)=>{
    const headers = buildBasicHeaders();
    const createDropletUrl = API_BASE_URL + "droplets";
    const sshKeys = [process.env.sshKeys]

    const data = {
        "name":name,
        "size":size,
        "image":parseInt(image),
        "ssh_keys": sshKeys
    }

    fetch(createDropletUrl,{
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(res=>res.json())
    .then((res)=>{
        console.log(res)
    })
}


const getDroplet = async (dropletId)=>{
    const headers = buildBasicHeaders();
    const url = API_BASE_URL + `droplets/${dropletId}`;
    return await fetch(url,{
        headers: headers
    })
    .then(res=>res.json())
    .then(res=>res['droplet'])
}

const getDroplets = async ()=>{
    const headers = buildBasicHeaders();
    const url = API_BASE_URL + `droplets?page=1`;
    return await fetch(url,{
        headers: headers
    })
    .then(res=>res.json())
    .then(res=>res['droplets'])
}

const getDistributions = async (filter="")=>{
    const headers = buildBasicHeaders();
    const url = API_BASE_URL + `images?type=distribution`
    return await fetch(url, {
        headers:headers
    }).then(res=>res.json())
    .then(res=>res['images'])
    .then((res)=>{
        const distros = res.filter((distro)=>distro['status'] === "available")
        if(filter === "") return distros;
        return distros.filter((distro)=>distro['title'].includes(filter))
    })
}

export { createDroplet, getDroplet, getDroplets }