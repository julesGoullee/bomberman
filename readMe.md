BomberCat
==========
Web Game bomberman brain wave, in First person shoot, multiplayers, 3D ( with babylonjs engine ([https://github.com/BabylonJS/Babylon.js](https://github.com/BabylonJS/Babylon.js)).

[![Build Status](https://travis-ci.org/julesGoullee/bomberman.png)](https://travis-ci.org/julesGoullee/bomberman)
[![dependencies Status](https://david-dm.org/julesGoullee/bomberman.svg)](https://david-dm.org/julesGoullee/bomberman#info=dependencies&view=table)
[![dev dependencies Status](https://david-dm.org/julesGoullee/bomberman/dev-status.svg)](https://david-dm.org/julesGoullee/bomberman#info=devDependencies&view=table)

##Pré requis:
```bash
sudo apt-get install openssl nginx
```
node@5 (use nvm [https://github.com/creationix/nvm](https://github.com/creationix/nvm))

##Config:
- Generate ssl cert :
```bash
    sudo openssl  req -x509 -nodes -days 365 -newkey rsa:2048 -keyout config/nginx/ssl/nginx.key -out config/nginx/ssl/nginx.crt
```
- Copy in nginx directory and restart service:
```bash
sudo cp -R config/nginx/. /etc/nginx/ &&
sudo ln -s /etc/nginx/sites-available/** &&
sudo ln -s /etc/nginx/sites-enable/** && sudo service nginx restart
```
- Ignore changed git: 
```bash
git update-index --assume-unchanged config/nginx/ssl/**
```
- Edit In /config development & production directory

##INSTALL:
- Npm Dependencies:
```bash
npm install
```
- Gulp task Build: copy config, externals bower, Webpack bundle
```bash 
npm run dev 
```
- Test:
```bash 
npm test
```

##Demo:
[https://monchezmoi.no-ip.org](https://monchezmoi.no-ip.org)
