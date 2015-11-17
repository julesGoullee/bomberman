"use strict"; /* jshint unused: false */

module.exports = function(app) {
  if (process.env.NODE_ENV === "development") {

    app.use(function (err, req, res, next) {

      res.status(500);

      res.json({
        code: res.statusCode,
        data: err.data,
        stack: err.stack
      });
    });
  }

  //No stack in production
  if (process.env.NODE_ENV === "production") {

    app.use(function (err, req, res, next) {
      if (!res.statusCode) {
        res.status(500);
      }

      res.json({
        code: res.statusCode,
        data: "internal server error"
      });
    });
  }
};
