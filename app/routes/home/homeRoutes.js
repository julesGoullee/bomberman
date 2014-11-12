"use strict";
var config = require('../../config/config.js');
var ejs = require('ejs');
var fs = require('fs');

function homeRoutes(app){
    var appFile = fs.readFileSync(config.rootPath + '/app/routes/home/home.html').toString();

    var appRended = ejs.render(appFile,{} );

    var dependances ={
        scripts:[
            'module/block.js',
            'module/bomb.js',
            'module/player.js',
            'module/scene.js',
            'module/map.js',

            'module/camera.js',
            'module/ligth.js',
            'module/meshHelper.js',

            'main.js'
        ],
        css:[
            'css/style.css'
        ]
    };

    function commonResponseGetPost(res){
        res.render('static/commonPartial/index.html', {dependances: dependances, app : appRended, title: 'Bomberman'});
    }

    app.post('/',function(req,res){
        commonResponseGetPost(res);
    });

    app.get('/',function(req,res){
        commonResponseGetPost(res);
    });
}

module.exports = function(app){
    homeRoutes(app);
};