"use strict";

var config = require( "../../config/config" );
var ejs = require( "ejs" );
var fs = require( "fs" );

function homeRoutes( app ){

    var appFile = fs.readFileSync( config.rootPath + "/app/routes/home/home.html" ).toString();

    var appRended = ejs.render( appFile, {} );

    var dependances = {

        scripts:[
            "external/jquery/jquery",
            "external/bootstrap/bootstrap.min",
            "external/babylonjs/babylon.1.10.0",

            "module/utils",

            //debug
            "module/freeCamera",
            "module/switchCamera",

            "module/block",
            "module/bomb",
            "module/player",
            "module/map",
            "module/myPlayer",
            "module/game",
            "main"
        ],
        css:[
            "external/bootstrap/bootstrap.min",
            "external/bootstrap/bootstrap-theme.min",

            "css/style"
        ]
    };

    function commonResponseGetPost( res ) {

        res.render( "static/commonPartial/index.html", { dependances: dependances, app: appRended, title: "Bomberman" } );
    }

    app.post( "/" ,function( req, res ) {

        commonResponseGetPost( res );
    });

    app.get( "/",function( req, res ){

        commonResponseGetPost( res );
    });
}

module.exports = function( app ) {

    homeRoutes( app );
};