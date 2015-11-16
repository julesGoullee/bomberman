"use strict";
module.exports = function(app) {
  if (app.get("env") === "development") {

    app.use(function (err, req, res/*, next*/) {
      console.log("development");

      res.status(500);

      res.json({
        code: res.statusCode,
        data: err.data,
        stack: err.stack
      });
    });
  }

//No stack in production
  if (app.get("env") === "production") {

    app.use(function (err, req, res/*, next*/) {
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
