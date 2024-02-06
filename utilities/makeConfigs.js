#!/usr/bin/env node

import { readFileSync, writeFile, writeFileSync, existsSync } from "fs";
import inquirer from "inquirer";
import init from "../init.js";
import * as path from "node:path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFile = path.join(__dirname,"..",".env");



const doConfig = [
    {
        type: "input",
        name: "digitalOceanToken",
        message: "Enter your DigitalOcean token"
    },
    {
        type: "input",
        name: "localKeyFile",
        message: "Enter your local key file path",
        default: process.platform === "win32" ? `C:\\Users\\${process.env.USER}\\.ssh\\id_rsa` : "~/.ssh/id_rsa"
    },
    {
        type: "input",
        name: "sshFingerprint",
        message: "Enter your ssh fingerprint"
    }
];

const githubConfig = [
    {
        type: "input",
        name: "githubToken",
        message: "Enter your Github token"
    },
    {
        type: "input",
        name: "githubUsername",
        message: "Enter your Github username"
    },
    {
        type: "input",
        name: "githubInstallationId",
        message: "Enter your Github installation id for Netlify"
    }
];

const netlifyConfig = [
    {
        type: "input",
        name: "netlifyToken",
        message: "Enter your Netlify token"
    },
    {
        type: "input",
        name: "netlifyUsername",
        message: "Enter your Netlify username"
    },
    {
        type: "input",
        name: "userEmail",
        message: "Enter your E-mail"
    }
    
];

const vercelConfig = [
    {
        type: "input",
        name: "vercelToken",
        message: "Enter your Vercel token"
    }
];

const chooseConfig = [
    {
        type: "list",
        name: "platform",
        message: "Configure the tools you wish to use (for any doubt you will be able to change the configs later)",
        choices: ["Github","DigitalOcean", "Netlify", "Vercel", "Skip"]
    }
];
export const setupConfiguration = async ()=>{
    inquirer.prompt(chooseConfig).then(answers=>{
        switch(answers.platform){
            case "DigitalOcean":
                inquirer.prompt(doConfig).then(answers=>{
                    const {digitalOceanToken,localKeyFile,sshFingerprint} = answers;
                    const lines = [];
                    setEnvOption("doAuthToken",digitalOceanToken);
                    setEnvOption("localKeyFile",localKeyFile);
                    setEnvOption("sshKey",sshFingerprint);
                    setupConfiguration()
                })
                break;
            case "Github":
                inquirer.prompt(githubConfig).then(answers=>{
                    const {githubToken,githubUsername,githubInstallationId} = answers;
                    setEnvOption("gitToken",githubToken);
                    setEnvOption("gitUser",githubUsername);
                    setEnvOption("githubInstallationId",githubInstallationId);                
                    setupConfiguration()
                })
                break;
            case "Netlify":
                inquirer.prompt(netlifyConfig).then(answers=>{
                    const {netlifyToken,netlifyUsername,userEmail} = answers;
                    setEnvOption("netlifyToken",netlifyToken);
                    setEnvOption("netlifyUser",netlifyUsername);
                    setEnvOption("userMail",userEmail);
                    setupConfiguration()
                })
                break;
            case "Vercel":
                inquirer.prompt(vercelConfig).then(answers=>{
                    const {vercelToken} = answers;
                    setEnvOption("vercelToken",vercelToken);
                    setupConfiguration()
                })
                break;
            case "Skip":
                break;
        }
    })
}


const setEnvOption = (opt, value)=>{
    exsistOrCreateEnvFile();
    const data = readFileSync(envFile, "utf8");
    const rows = data.split("\n");
    const condfigExsist = rows.find(row=>row.startsWith(opt));
    if(condfigExsist){
        const lines = [];
        data.split("\n").forEach((line)=>{
            if(line.startsWith(opt)){
                line = `${opt}=${value}`
            }
            lines.push(line);
        })
        writeFileSync(envFile,lines.join("\n"),(err)=>{if(err)console.error(err)})
    }else{

        writeFileSync(envFile,data + `\n${opt}=${value}`,(err)=>{if(err)console.error(err)})
    }

}


const singleConfigurations = [
    "doAuthToken",
    "localKeyFile",
    "sshKey",
    "gitUser",
    "gitToken",
    "netlifyToken",
    "netlifyUser",
    "githubInstallationId",
    "userMail",
    "exit"
];


export const setConfiguration = (configs = null)=>{
    const configChoices = configs || singleConfigurations;
    exsistOrCreateEnvFile();
    const opts = readFileSync(envFile, "utf8").split("\n");
    inquirer.prompt([{
        type:"list",
        name:"option",
        message:"Choose a configuration to change",
        choices:configChoices
    },{
        type:"input",
        name:"value",
        message: (answers)=>`Enter the new value (current ${opts.find(opt=>opt.startsWith(answers.option))?.split("=")[1] || ""})`,
        when: (answers)=>answers.option !== "exit"
    }]).then(answers=>{
        if(answers.option === "exit"){
            init()
        }else{
            setEnvOption(answers.option,answers.value);
            setConfiguration(configs);
        }
        
    })
    
}



const exsistOrCreateEnvFile = ()=>{
    if(!existsSync(envFile)){
        writeFileSync(envFile,"",(err)=>{if(err)console.error(err)})
    }
}

export const exsistEnvFile = ()=>{
    return existsSync(envFile);
}





