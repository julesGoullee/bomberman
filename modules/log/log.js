"use strict";

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

global.log = log;
