"use strict";
const passport = require("passport");

class Auth {

  constructor (app) {
    this.app = app;
    this.signIn();
    this.signUp();
  }

  signIn() {
    this.app.get("/auth/token", (req, res) => {
      if(req.isAuthenticated()) {
        res.json({
          id: req.user._id,
          name: req.user.fb.username
        });
      }else{
        res.sendStatus(401);
      }
    });
  }

  signUp() {
    this.app.get("/auth/facebook/token", passport.authenticate("facebook-token"), (req, res) => {
      res.status(201);
      res.json({
        id: req.user._id,
        name: req.user.fb.username
      });
    });
  }
}

module.exports = Auth;
