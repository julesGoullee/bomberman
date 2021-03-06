BomberCat
==========
Web Game bomberman brain wave, in First person shoot, multiplayers, 3D ( with babylonjs engine ([https://github.com/BabylonJS/Babylon.js](https://github.com/BabylonJS/Babylon.js)).

[![Build Status](https://travis-ci.org/julesGoullee/bomberman.png)](https://travis-ci.org/julesGoullee/bomberman)
[![dependencies Status](https://david-dm.org/julesGoullee/bomberman.svg)](https://david-dm.org/julesGoullee/bomberman#info=dependencies&view=table)
[![dev dependencies Status](https://david-dm.org/julesGoullee/bomberman/dev-status.svg)](https://david-dm.org/julesGoullee/bomberman#info=devDependencies&view=table)

##Pré requis:
- Openssl
- Nginx
- MongoDb
- node@5 (use nvm [https://github.com/creationix/nvm](https://github.com/creationix/nvm))

##Config ssl cert for Nginx:
- Generate ssl cert :
```bash
npm run crt-generate-local
```
- Deploy local cert on nginx:
```bash
npm run deploy-nginx-local-crt
```

##Config Nginx:
- Deploy local nginx config and restart service:
```bash
npm run deploy-nginx-config
```
## Config App
In /config/{dev|prod}/:
- account.json: facebook app login
- config{client|Serve}: params game

##Developpement
- Npm Dependencies:
```bash
npm install
```
- Watch task ( jshint, config, mocha, karma, webpack bundle)
```bash 
gulp
```
- Add app domain to resolve host:
Add in /etc/hosts :
```bash
127.0.0.0.1    bombercat.io
```
- Test:
```bash 
npm test
```

##Deploiement
```bash 
NODE_ENV=production npm i --production
```
launch:
```bash 
NODE_ENV=production npm start
```

##Demo:
[https://monchezmoi.no-ip.org](https://monchezmoi.no-ip.org)
