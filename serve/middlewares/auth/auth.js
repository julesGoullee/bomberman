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
    done(err , user);
  });
});


module.exports = function(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/auth/token", function(req, res){
    if(req.isAuthenticated()) {
      res.json({
        id: req.user._id,
        name: req.user.fb.username
      });
    }else{
      res.sendStatus(401);
    }
  });

};
