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

##Config ssl cert for Nginx:
- Generate ssl cert :
```bash
npm run crt-generate-local
```
- Deploy local cert on nginx:
```bash
npm run deploy-nginx-local-crt
```
- Ignore cert in changelist git(dev): 
```bash
git update-index --assume-unchanged config/nginx/ssl/**
```

##Config Nginx:
- Deploy local nginx config and restart service:
```bash
npm run deploy-nginx-config
```

##INSTALL:
- Npm Dependencies:
```bash
npm install
```

##Developpement
- Gulp task Build: copy app config, externals bower, Webpack bundle
```bash 
npm run dev 
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

##Demo:
[https://monchezmoi.no-ip.org](https://monchezmoi.no-ip.org)
