"use strict";

var config = require("./config/config");

var express = require("express");
//var logger = require("morgan");
//app.use(logger("dev"));

var app = express();
app.set( "port", config.port );
app.set("etag", "strong");
app.set('x-powered-by', false);



require("./middlewares/compress")(app);
require("./middlewares/static")(app);
require("./middlewares/auth/session")(app);
require("./middlewares/auth/auth")(app);
require("./middlewares/auth/facebook")(app);

require("./middlewares/404")(app);

require("./middlewares/error")(app);

module.exports = app;
