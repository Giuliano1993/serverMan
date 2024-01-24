import { configDotenv } from "dotenv"
configDotenv()
export default async function ProjectList() {
    const {vercelToken} = process.env;
    const sites = await fetch("https://api.vercel.com/v9/projects", {
      "headers": {
        "Authorization": `Bearer ${vercelToken}`
      },
      "method": "get"
    }).then(response => response.json())
    .then(data => {
      console.log(data.projects);
      return data.projects
    })        

    console.log(sites.map(((s)=>s.name)))
  
}