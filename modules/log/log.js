"use strict";

var utils = require("../utils/utils.js");

function log( message , status ){
    var date = utils.dateToString( new Date() );
    var statusString = status ? "[" + status.toUpperCase() + "]" : "";
    console.log( statusString + "[" + date + "] "  + message );

}

global.log = log;
