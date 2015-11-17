"use strict";

var config = require("./config/config");

var express = require("express");

var app = express();

app.set( "port", config.port );
app.set("etag", "strong");
app.set('x-powered-by', false);

require("./middlewares/logRequest")(app);
require("./middlewares/cors")(app);
require("./middlewares/compress")(app);

require("./routes/static")(app);

require("./middlewares/auth/session")(app);
require("./middlewares/auth/auth")(app);
require("./middlewares/auth/facebook")(app);

require("./middlewares/404")(app);

require("./middlewares/error")(app);

module.exports = app;
