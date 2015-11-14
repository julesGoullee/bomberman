"use strict";

module.exports = function(app) {
  // catch 404
  app.use(function( req, res ){
    res.status( 404 );
    res.send("File not found!" + req.originalUrl);
  });
};