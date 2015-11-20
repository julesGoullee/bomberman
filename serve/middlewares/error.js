"use strict"; /* jshint unused: false */
var errorLog = require("../modules/log/log").error;

module.exports = function(app) {
  if (process.env.NODE_ENV === "development") {

    app.use(function (err, req, res, next) {

      res.status(500);

      res.json({
        code: res.statusCode,
        data: err.data,
        stack: err.stack
      });
      throw err;

    });
  }

  //No stack in production
  if (process.env.NODE_ENV === "production") {

    app.use(function (err, req, res, next) {

      errorLog.error(err.stack);

      res.status(500);

      res.json({
        code: res.statusCode,
        data: "internal server error"
      });
    });
  }
};
