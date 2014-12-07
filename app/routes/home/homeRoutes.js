"use strict";

var config = require( "../../config/config" );
var ejs = require( "ejs" );
var fs = require( "fs" );

function homeRoutes( app ){

    var appFile = fs.readFileSync( config.rootPath + "/app/routes/home/home.html" ).toString();

    var appRended = ejs.render( appFile, {} );

    var dependances = {

        scripts:[
            "socket.io/socket.io",

            "external/jquery/jquery",
            "external/bootstrap/bootstrap.min",
            "external/babylonjs/oimo",
            "external/babylonjs/babylon.1.10.0",

            // ftc utilitaire
            "modules/utils/utils",
            "modules/config/config",

            //modules
            "modules/preloader/preloader",
            "modules/keyBinder/keyBinder",
            "modules/restore/restore",
            "modules/block/block",
            "modules/bomb/bomb",
            "modules/camera/freeCamera",
            "modules/camera/CameraSwitcher",
            "modules/connector/connector",
            "modules/game/game",
            "modules/map/map",
            "modules/player/player",
            "modules/player/myPlayer",
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