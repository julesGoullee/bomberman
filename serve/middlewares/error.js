"use strict"; /* jshint unused: false */
var errorLog = require("../modules/log/log").error;

module.exports = function(app) {
  if (process.env.NODE_ENV === "development") {

    app.use(function (err, req, res, next) {

      res.status(500);

      res.json({
        code: res.statusCode,
        data: err.data,
        message: err.message,
        stack: err.stack
      });
      errorLog.error(err);

    });
  }

  //No stack in production
  if (process.env.NODE_ENV === "production") {

    app.use(function (err, req, res, next) {

      errorLog.error(err);

      res.status(500);

      res.json({
        code: res.statusCode,
        data: "internal server error"
      });
    });
  }
};
