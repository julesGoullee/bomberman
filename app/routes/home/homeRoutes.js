var config = require('../../config/config.js');
var ejs = require('ejs');
var fs = require('fs');

function homeRoutes(app){
    var appFile = fs.readFileSync(config.rootPath + '/app/routes/home/home.html').toString();

    var appRended = ejs.render(appFile,{} );

    var dependances ={
        scripts:[
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