import { configDotenv } from "dotenv"
import { fileURLToPath } from 'url';
import * as path from "node:path";
import { error } from "console";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
configDotenv({path: __dirname + '/../../.env'})


export const netlifyRequest = async (url, body={}, contentType = "application/json",method = "POST")=>{
    const {netlifyToken, netlifyUser} = process.env;
    const netlifyAPI = "https://api.netlify.com";

    const reqPars = {
        method,
        headers: {
            "Authorization": `Bearer ${netlifyToken}`,
            "Content-Type": contentType
        }
    }
    if(method !== "GET"){
        reqPars['body'] = JSON.stringify(body);
    }

    // here need to be added control on the response status
    return await fetch(netlifyAPI + url, reqPars).then((res)=>{
        if(!res.ok){
            //console.log(res.status, res.statusText)
            const err = new Error(res.statusText);
            err.status = res.status;
            throw err;
        }
        return res.json()
        
    });   
}


export const verifyNetlifyConfig = ()=> process.env.netlifyToken && process.env.netlifyUser;
export const getNetlifyDeployKey = async ()=> await netlifyRequest("/api/v1/deploy_keys").then((res)=>{console.log(res); return res['public_key']});
