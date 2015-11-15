"use strict";

define(["js-cookie/src/js.cookie"], function(Cookies) {
  return function Connector(popup) {

    var self = this;

    var _socket = {};

    //PUBLIC METHODS//

    //StartConnection

    self.launch = function (callback) {
      _socket = io();
      _socket.on('connect', function(){
        callback();
      });
      _socket.on('disconnect', function () {
        popup.setContent("Error", "Disconnect game, you have already connection active");
        popup.show();
        console.error("Disconnect game, you have already connection active");
      });
    };

    //Authentification
    
    self.signUp = function (token, callback){
      $.get("/auth/facebook/token?access_token=" + token)
        .done(function(userProfile) {
            callback(userProfile);
        })
        .fail(function(res) {
          console.error("[Auth] " + res);
          callback(false);
        });
    };

    self.signIn = function (callback){
      if(Cookies.get("token")){
        $.get("/auth/token")
          .done(function(userProfile){
            callback(userProfile);
          })
          .fail(function() {
            Cookies.remove('token');
            callback(false);
          });
      }else{
        callback(false);
      }
    };

    //Game
    self.getMap = function (callback) {

      _socket.on("map", function (map) {

        callback(map);
      });

    };

    self.ready = function () {
      _socket.emit("ready", {});
    };

    self.onReady = function (callback) {
      _socket.on("ready", function (partyData) {
        callback(partyData.partyTimer);
      });
    };

    self.onEnd = function (callback) {
      _socket.on("endPartie", function () {
        callback();
      });
    };

    self.sendMyPosition = function (position) {

      _socket.emit("myPosition", position);
    };

    self.onNewPlayer = function (callback) {

      _socket.on("newPlayer", function (playerData) {

        callback(playerData.id, playerData.name, playerData.position, playerData.powerUp, playerData.alive, playerData.kills);
      });
    };

    self.onPlayerMove = function (callback) {

      _socket.on("onPlayerMove", function (playerData) {

        callback(playerData.id, playerData.position);
      });
    };

    self.onPlayerDisconnect = function (callback) {

      _socket.on("playerDisconnect", function (playerData) {

        callback(playerData.id);
      });
    };

    self.onPlayerSetBomb = function (callback) {

      _socket.on("setBomb", function (bombeData) {

        callback(bombeData.ownerId, bombeData.bombeId, bombeData.position);
      });
    };

    self.setBomb = function (bombTempId) {

      _socket.emit("setBomb", bombTempId);
    };

    self.setPermanentBombId = function (callback) {
      _socket.on("setPermanentBombId", function (data) {
        callback(data.tempId, data.id);
      });
    };

    self.onExplosion = function (callback) {

      _socket.on("explosion", function (explosionData) {
        callback(explosionData.ownerId, explosionData.bombesExplodedId, explosionData.playersIdKilled, explosionData.blocksIdDestroy);
      });
    };

    //PRIVATE METHODS//

  };
});