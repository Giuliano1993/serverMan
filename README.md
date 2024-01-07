# ServerMan

**Serverman** is a comprehensive tool for managing your servers across different platforms directly from your terminal.
Being a porting of the previous python version there are still some work in progress and any contribution is welcome.

At the moment the tool handle DigitalOcean Server Creation and Sites addition, and deploying Github repos on netlify. 

While improving functionalities on the previous two platform, Vercel is next to come on the repo. 


### Getting started locally
In order to get this tool running, you will need some config:

- first of all you will need a Digital Ocean Token. You can get it [here](https://cloud.digitalocean.com/account/api/tokens?i=75bc4f)
- generate your key and copy it in your **.env** file using the key  ```doAuthToken```

- Now add the SSH key; You can either use an already exsisting key or creating a new one:
  - To add a new ssh key from your computer to ssh you can go [here](https://cloud.digitalocean.com/account/security?i=75bc4f) after adding it copy the fingerprint and add it to sshKeys in your `.env` file. This will allow the script to access the ssh and configure your server

- Then add your git infos: in order to clone your git repositories you will need your username and token in your `.env` file or directly prompted during server setup. Either if you want to put it in your  env file or ask for it during setup. you will need a github token in order to cone it.
You can get one by going [here](https://github.com/settings/tokens), or guided step by step: 
1. open [Github](https://github.com/)
2. click on your profile image on top right corner
3. Select "**Settings**"
4. Select "**Developer Settings**"
5. Go to Personal Access tokens > tokens
6. Generate new token
7. Choose an expiration date and check all the repo checkbokes
8. give it a name and copy your new token


If you wish to use ServerMan to create sites on netlify you will need to connect Netlify and github manually and save the installation ID.
To create you connection between Netlify and github you just need to go on [netlify user settings](https://app.netlify.com/user/settings) and configure the connection with your github account (grant access to all the repos to easily deploy further projects).
After doing this you can con on [Github Application settings](https://github.com/settings/installations) click on <key>configure</key>  and copy the number appended at the end of the url into your `.env` file