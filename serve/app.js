"use strict";

var config = require("./config/config");

var express = require("express");
var path = require("path");
var logger = require("morgan");

var app = express();
app.set( "port", config.port );
app.set("etag", "strong");
app.use(logger("dev"));



require("./middlewares/compress")(app);
require("./middlewares/static")(app);
require("./middlewares/auth/session")(app);
require("./middlewares/auth/auth")(app);
require("./middlewares/auth/facebook")(app);

require("./middlewares/404")(app);

require("./middlewares/error")(app);

module.exports = app;
