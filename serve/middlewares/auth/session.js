"use strict";
var session = require("express-session");
var mongoConnector = require("../../modules/storage/connection");
var cookieParser = require("cookie-parser");
var MongoStore = require("connect-mongo")(session);

var sessionMiddleware = session({
  secret: "keyboard cat",
  name: "token",
  proxy: true,
  resave: true,
  store: new MongoStore({
    mongooseConnection: mongoConnector.getConnection(),
    stringify: false
  }),
  saveUninitialized: false,
  cookie: {secure: false}
});


function Session(app){
  app.use(cookieParser());
  app.use(sessionMiddleware);
}

Session.prototype.getMiddleware = function(){
  return sessionMiddleware;
};

module.exports = Session;