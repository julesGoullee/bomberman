"use strict";

var config = require( "../../config/config" );
var ejs = require( "ejs" );
var fs = require( "fs" );

function homeRoutes( app ){

    var appFile = fs.readFileSync(__dirname + "/home.html" ).toString();

    var appRended = ejs.render( appFile, {} );

    var dependances = {

        scripts:[
            "socket.io/socket.io",
            "external/jquery",
            "external/bootstrap",
            "external/jquery.bootstrap-growl",
            "external/babylonjs/oimo",
            "external/babylonjs/babylon",

            // ftc utilitaire
            "modules/utils/utils",
            "modules/config/config",
            "modules/notifier/notifier",
            "modules/popup/popup",

            //modules
            "modules/preloader/preloader",
            "modules/keyBinder/keyBinder",
            "modules/restore/restore",
            "modules/block/block",
            "modules/bomb/bomb",
            "modules/camera/freeCamera",
            "modules/camera/CameraSwitcher",
            "modules/camera/DeadView",
            "modules/connector/connector",
            "modules/game/game",
            "modules/maps/maps",
            "modules/player/player",
            "modules/player/myPlayer",
            "modules/player/notifyMovePlayer",
            "modules/powerUp/powerUp",
            "modules/bot/bot",
            "modules/auth/auth",
            "modules/menuPlayers/menuPlayers",
            "main"
        ],
        css:[
            "external/bootstrap",
            "external/bootstrap-theme",

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

    //Common response BabylonjsManifest
    app.use( "/*babylon.manifest*", function ( req, res ) {
        res.sendFile( "/content/common.babylon.manifest", { "root": config.rootPathPublic } );
    })
}

module.exports = function( app ) {

    homeRoutes( app );
};