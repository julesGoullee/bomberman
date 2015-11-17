"use strict";
var logger = require("morgan");

module.exports = function(app){
  app.use(logger("dev", {
    skip: function (req, res) {
      return res.statusCode < 400;
    }
  }));
};
