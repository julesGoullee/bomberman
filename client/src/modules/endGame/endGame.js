"use strict";

const Popup = require("popup/popup.es6");

module.exports =  function EndGame() {
  var self = this;

  var _header;
  var _footer;
  var _body;

  var _replayCallback;

  //PUBLIC METHODS//

  self.showEndPopup = function (map) {

    var players = map.getPlayers();
    var tablePlayers = "";

    players.sort(function (a, b) {
      return a.kills <= b.kills;
    });

    for (var i = 0; i < players.length; i++) {
      var player = players[i];
      var statusString = player.alive ? "En vie" : "Mort";
      statusString = player.kamicat || statusString;
      var kills = player.kills > 0 ? player.kills : "-";
      var nbBombe = player.totalNbBombe > 0 ? player.totalNbBombe : "-";
      var nbBlocksDestroy = player.nbBlocksDestroy > 0 ? player.nbBlocksDestroy : "-";

      tablePlayers += "<tr>" +
        "<td>" + kills + "</td>" +
        "<td>" + player.name + "</td>" +
        "<td>" + statusString + "</td>" +
        "<td>" + nbBombe + "</td>" +
        "<td>" + nbBlocksDestroy + "</td>" +
        "</tr>";
    }

    Popup.setContent(_header, _body, _footer);
    $("#table-score-body").append(tablePlayers);

    Popup.show();

    $("#btn-rejouer").click(function () {
      Popup.hide();
      ga('send', 'event', 'replay');
      return typeof _replayCallback === "function" && _replayCallback();
    });

    //ga('send', 'event', 'blocksDestroy', nbBlocksDestroy);//TODO recuperer my player
    //ga('send', 'event', 'nbBombs', nbBombe);

  };

  self.onReplay = function (callback) {
    _replayCallback = callback;
  };

  //PRIVATE METHODS//

  function init() {

    _header = "<h4 class='modal-title' >Partie Terminée!</h4>";

    _footer = "<button type='button' class='btn btn-primary' id='btn-rejouer'>Rejouer!</button>";

    _body = "<table class='table table-striped' id='table-score'>" +
      "<thead>" +
      "<tr>" +
      "<th>Kills</th>" +
      "<th>Nom</th>" +
      "<th>Statu</th>" +
      "<th>Total Bombes</th>" +
      "<th>Total blocks</th>" +
      "</tr>" +
      "</thead>" +
      "<tbody id='table-score-body'></tbody>" +
      "</table>";
  }

  init();

};
