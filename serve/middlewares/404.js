"use strict";

module.exports = function(app) {
  app.use(function( req, res ){
    //if (!res.statusCode) {
      res.sendStatus(404);
    //}
  });
};