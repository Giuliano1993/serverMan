import { configDotenv } from "dotenv"
configDotenv({path: __dirname + '/../../.env'})


export const netlifyRequest = async (url, body={}, contentType = "application/json",method = "POST")=>{
    const {netlifyToken, netlifyUser} = process.env;
    const netlifyAPI = "https://api.netlify.com";

    return await fetch(netlifyAPI + url,{
        method,
        headers: {
            "Authorization": `Bearer ${netlifyToken}`,
            "Content-Type": contentType
        },
        body: JSON.stringify(body)
    }).then(res=>res.json());   
}

export const getNetlifyDeployKey = async ()=> await netlifyRequest("/api/v1/deploy_keys").then(res=>res['public_key']);
