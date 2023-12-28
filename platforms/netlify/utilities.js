import { configDotenv } from "dotenv"
configDotenv()


export const netlifyRequest = async (url, body, contentType = "application/json",method = "POST")=>{
    const {netlifyToken, netlifyUser} = process.env;
    const netlifyAPI = "https://api.netlify.com";

    return await fetch(netlifyAPI + url,{
        method,
        headers: {
            "Authorization": `Bearer ${netlifyToken}`,
            "Content-Type": contentType
        },
        body
    }).then(res=>res.json());   
}