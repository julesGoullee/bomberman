"use strict";

var passport = require("passport");
var FacebookTokenStrategy = require("passport-facebook-token");

var session = require("express-session");
var mongoConnector = require("../modules/storage/connection");
var cookieParser = require("cookie-parser");
var MongoStore = require("connect-mongo")(session);

var authLog = require("../modules/log/log").auth;
var User = require("../modules/storage/models/user");
var accounts = require( "../config/account.json");

var sessionMiddleware = session({
  secret: "keyboard cat",
  name: "token",
  proxy: false,
  resave: true,
  store: new MongoStore({
    mongooseConnection: mongoConnector.getConnection(),
    stringify: false
  }),
  saveUninitialized: false,
  cookie: {httpOnly: false, secure: false}
});

passport.serializeUser(function( user, done ){
  done(null, user._id);
});

passport.deserializeUser(function( id, done ){

  User.findById(id, function (err, user) {
    done(err , user);
  });
});

passport.use(new FacebookTokenStrategy({
    clientID: accounts.clientID,
    clientSecret: accounts.clientSecret
  }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {

      User.findOne({ "fb.id": profile.id}, function(err, user){
        if(!user){
          User.create({
            fb: {
              id: profile.id,
              username: profile.name.givenName + " " + profile.name.familyName ,
              email: Array.isArray(profile.emails) && profile.emails[0].value,
              token: accessToken,
              photo: {
                url: Array.isArray(profile.photos) && profile.photos[0].value
              }
            }
          },function(err, user){
            done(err, user.toObject());
          });

        } else{
          done(err, user.toObject());
        }
      });
    });
  }
));

module.exports = {
  initialize: (app) => {
    app.use(cookieParser());
    app.use(sessionMiddleware);
    app.use(passport.initialize());
    app.use(passport.session());
  },
  check: (req, res, cb) => {
    sessionMiddleware(req, res, function(){
      passport.initialize()(req, res, function(){
        passport.session()(req, res, function(){
          authLog.info("Check cookie: " + req.isAuthenticated());
          cb( req.isAuthenticated());
        });
      });
    });
  }
};
