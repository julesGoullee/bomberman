"use strict";
const Popup = require("popup/popup.es6");

const errMsg = "Web GL not supported, " +
  "<a href='https://www.google.fr/chrome/browser/desktop/' class='btn btn-primary'>" +
  "Get chrome !" +
  "</a>";

module.exports = (cb) => {

  const isSupportedWebGL = BABYLON.Engine.isSupported();

  if (isSupportedWebGL) {
    cb();
  } else {

    Popup.setContent("Error", errMsg).show();
  }
};
