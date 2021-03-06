"use strict";

define(function() {
  return function MenuPlayers() {

    var self = this;

    var _playersContainer;


    //PUBLIC METHODS//

    self.addPlayer = function (player) {

      var status = player.alive === true ? "En vie" : "Mort";

      var playerHTML = "<li class='list-group-item list-inline list-player-item' id='menu-player-" + player.id + "'>" +
        "<ul class='list-group'>" +
        "<li class='list-group-item'>" + player.name + "</li>" +
        "<li class='list-group-item'><img src='" + player.picture + "' alt='userPicture' class='img-circle fb-picture'></li>" +
        "<li class='list-group-item player-status'>" + status + "</li>" +
        "<li class='list-group-item player-score'> Score : " + player.kills + "</li>" +
        "</ul>" +
        "</li>";

      _playersContainer.append(playerHTML);

    };

    self.delPlayer = function (idPlayer) {

      $('#menu-player-' + idPlayer).remove();

    };

    self.delPlayers = function () {
      $(".list-player-item").remove();
    };

    self.changeStatus = function (newStatus, idPlayer) {

      $('#menu-player-' + idPlayer).find(".player-status").text(newStatus);

    };

    self.changeScore = function (newScore, idPlayer) {

      $('#menu-player-' + idPlayer).find(".player-score").text("Score : " + newScore);

    };


    //PRIVATE METHODS//

    function init() {

      _playersContainer = $("#menuPlayers").find("ul");
    }

    init();

  };
});
