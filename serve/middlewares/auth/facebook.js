"use strict";
var FacebookTokenStrategy = require("passport-facebook-token");
var passport = require("passport");
var User = require("../../modules/storage/models/user");
//var jf = require("jsonfile");
//var accounts = jf.readFileSync( __dirname + "/config/account.json");

passport.use(new FacebookTokenStrategy({
    clientID: "1562153034052094",
    clientSecret: "e0b170619cb2fb6b5706bb6bdff60873"
  }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {

      User.findOne({ "fb.id": profile.id}, function(err, user){
        if(!user){
          User.create({
            fb:{
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

module.exports = function(app) {
  app.get("/auth/facebook/token", passport.authenticate("facebook-token"), function(req, res) {
    res.status(201);
    res.json({
      id: req.user._id,
      name: req.user.fb.username
    });
  });


  app.use(function (err, req, res/*, next*/) {
    if(err){
      res.status(400);
      res.send("Facebook Oauth [ERROR]" + err);
    }
  });

};
