"use strict";

var compress = require("compression");

module.exports = function(app) {

  var contentTypeToCompress = [
    "application/octet-stream",
    "application/javascript",
    "text/css; charset=UTF-8",
    "application/json"
  ];

  function shouldCompress(req, res) {

    if( res.statusCode === 200 ){
      var contentType = res.getHeader("Content-Type");
      return contentTypeToCompress.indexOf(contentType) !== -1;
    }
    else {
      return false;
    }
  }

  app.use(compress({filter: shouldCompress}));

  app.use(function (req, res, next) {
    res.setHeader("Cache-Control", "no-cache");
    next();
  });

};
