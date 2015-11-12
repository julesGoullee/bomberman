"use strict";

define(function() {
  return function Notifier() {

    var self = this;

    var growlConf = {
      ele: "body", // which element to append to
      type: "success", // (null, 'info', 'danger', 'success')
      offset: {from: "top", amount: 20}, // 'top', or 'bottom'
      align: "center", // ('left', 'right', or 'center')
      width: "auto", // (integer, or 'auto')
      delay: 1000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
      allow_dismiss: false, // If true then will display a cross to close the popup.
      stackup_spacing: 10 // spacing between consecutively stacked growls.
    };

    self.showMessage = function (message) {

      $.bootstrapGrowl("<span class='glyphicon glyphicon-repeat' aria-hidden='true'></span><span class='messNotifier'>" + message + "</span>", growlConf);

    };


  };
});
