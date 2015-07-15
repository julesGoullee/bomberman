"use strict";

var config = require( "../../config/config.js" );

var server = require("../server/server.js" );

function dateToString( date ){
    var dayOfMonth = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate() ;
    var month = (date.getMonth() < 10) ? "0" + date.getMonth() : date.getMonth() ;
    var curHour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var curMinute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var curSeconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    return curHour + "h:" + curMinute + "m:" + curSeconds  + "s " + dayOfMonth + "/" + month;
}

function log( message , status ){
    var date = dateToString( new Date() );
    var statusString = status ? "[" + status.toUpperCase() + "]" : "";
    console.log( statusString + "[" + date + "] "  + message );

}

function logServ(app){

    server.onListenStart(function(){
        log( "server " + config.domaine + "listen on " + config.port + "...", "info");
    });
}

global.log = log;

module.exports ={
    start : function( app ){

        logServ( app );
    }
};