"use strict";

var config = require("./config/config");

var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var compress = require('compression');
//var logger = require("morgan");
//app.use(logger("dev"));

var routes = require("./routes/index");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(favicon(__dirname + "/client/dist/assets/favicon.ico"));

//routes
app.use("/", routes);

//Common response BabylonjsManifest
app.use( "/*babylon.manifest*", function ( req, res ) {
    res.sendFile( "/assets/common.manifest", { "root": config.rootPathPublic } );
});

var oneDay = 86400000;

app.use(compress({filter: shouldCompress}));

var contentTypeToCompress = [
    'application/octet-stream',
    'application/javascript',
    'text/css; charset=UTF-8',
    'application/json'
];

function shouldCompress(req, res) {

    if( res.statusCode === 200 ){
        var contentType = res.getHeader('Content-Type');
        //console.log(contentType, req.url );
        return contentTypeToCompress.indexOf(contentType) !== -1;
    }
    else {
        return false;
    }
}
app.use(compress({filter: shouldCompress}));


app.use(function (req, res, next) {
    res.setHeader('Cache-Control', 'no-cache');

    if (req.url.indexOf(".js") !== -1) {
        //log("match " + req.url);

    }else{
        //log("NOT match " + req.url);
    }
    next();
});


//Static files
app.use(express.static( config.rootPathPublic , {
    maxage: oneDay
}));

// catch 404
app.use(function( req, res ){
    res.status( 404 );
    res.send("File not found!" + req.originalUrl);
});

module.exports = app;
