"use strict";

var _container;

class Popup {

  static setContent (header="", body="", footer="") {
    $("#popup-container").html(body);

    $("#popup-header").html("<h4 class='modal-title'>" + header + "</h4>");

    $("#popup-footer").html(footer);
    return this;
  }

  static show() {

    _container.modal({
      backdrop: 'static',
      keyboard: false
    });
  }

  static hide() {

  _container.modal("hide");
  }
}

function init() {

  $('body').append(
    '<div class="modal fade" id="popup" role="dialog" aria-labelledby="popup" aria-hidden="true">' +
    "<div class='modal-dialog'>" +
    "<div class='modal-content'>" +
    "<div class='modal-header'>" +
      //"<button type='button' class='close hideModal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"+
    "<div id='popup-header'></div>" +
    "</div>" +
    "<div class='modal-body' id='popup-container'></div>" +
    "<div class='modal-footer' id='popup-footer'></div>" +
    "</div>" +
    "</div>" +
    "</div>"
  );

  _container = $("#popup");

  $(".hideModal").click( ()=>{

    Popup.hide();
  });
}

init();
module.exports = Popup;
