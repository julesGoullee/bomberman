"use strict";
const Popup = require("popup/popup.es6");

module.exports = (cb) => {

  const isSupportedWebGL = BABYLON.Engine.isSupported();

  if (isSupportedWebGL) {
    cb();
  } else {
    const content = "Web GL not supported, " +
      "<a href='https://www.google.fr/chrome/browser/desktop/' class='btn btn-primary'>" +
      "Get chrome !" +
      "</a>";
    Popup.setContent("Error", content).show();
  }
};
