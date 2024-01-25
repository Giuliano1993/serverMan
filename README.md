# ServerMan

**Serverman** is a comprehensive tool for managing your servers across different platforms directly from your terminal.
Being a porting of the previous python version there are still some work in progress and any contribution is welcome.

At the moment the tool handle DigitalOcean Server Creation and Sites addition, and deploying Github repos on netlify. 

While improving functionalities on the previous two platform, Vercel is next to come on the repo. 

## Installation

To install ServerMan locally just open a terminal and run:

```bash
npm i -g ghostylab/serverman@latest
```

then to use it you can run

```bash
sm
```
or

```bash
serverman
```

### Configuration
The first time you'll run serverman you'll be asked to provide some configurations.
Don't worry if you don't have everything at your first run, you can always access and edit your configs later
### Digital Ocean

#### doAuthToken
- Your Digital Ocean Token. You can get it [here](https://cloud.digitalocean.com/account/api/tokens?i=75bc4f)

#### localKeyFile
- the path to your ssh key (necessary for ssh your way to the server)


#### sshKey
- your Ssh key fingerprint. You can either use an already exsisting key or creating a new one. To add a new ssh key from your computer to Digital Ocean's recognized keys you can go [here](https://cloud.digitalocean.com/account/security?i=75bc4f). You can then ad the fingerprint to your config.


### GitHub

#### GitUser
Your github username

#### GitToken
Your Github Token. You can get one by going [here](https://github.com/settings/tokens)


### Netlify 

#### NetlifyUser
Your netlify username

#### NetlifyToken
Your Netlify Token.
You can get one by going [here](https://github.com/settings/tokens)


#### GithubInstallation 
Your Netlify Installation ID on github.
If you wish to use ServerMan to create sites on netlify you will need to connect Netlify and github manually and save the installation ID.
To create you connection between Netlify and github you just need to go on [netlify user settings](https://app.netlify.com/user/settings) and configure the connection with your github account (grant access to all the repos to easily deploy further projects).
After doing this you can con on [Github Application settings](https://github.com/settings/installations) click on <key>configure</key>  and copy the number appended at the end of the url. 
### Vercel

#### vercelToken
Your Vercel Token