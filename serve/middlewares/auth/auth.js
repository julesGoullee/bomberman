"use strict";
var passport = require("passport");

//var jf = require('jsonfile');
//var accounts = jf.readFileSync( __dirname + "/config/account.json");
var User = require('../../modules/storage/models/user');


passport.serializeUser(function( user, done ){
  done(null, user._id);
});

passport.deserializeUser(function( id, done ){

  User.findById(id, function (err, user) {
    done(err , id);
  });
});


module.exports = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/auth/token", function(req, res, next){
    if(req.isAuthenticated()) {
      res.sendStatus(200);
    
    }else{
      res.sendStatus(401);
    }
  });

};