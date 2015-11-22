"use strict";/* globals io */

define(["js-cookie/src/js.cookie", "popup/popup.es6"], function(Cookies, Popup) {
  return function Connector() {

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
        var errorMsg = "Disconnect game, probably you loose internet access or you have already connection active";
        Popup.setContent("Error", errorMsg).show();
        throw  Error(errorMsg);
      });
    };

    //Authentification

    self.signUp = function (token, callback){
      var req = $.get("/auth/facebook/token?access_token=" + token);
      var ttlReq = timeOutReq(req);

      req.done(function(userProfile) {
        clearTimeout(ttlReq);
        callback(userProfile);
      });

      req.fail(function(res) {
        if(res.statusText === "abort"){
          Popup.setContent("Error", "API authentification Facebook not available, please try later").show();
        }
        console.error("[Auth] " + JSON.stringify(res));
      });
    };

    self.signIn = function (callback){
      var req = $.get("/auth/token");
      var ttlReq = timeOutReq(req);
      req.done(function(userProfile){
        clearTimeout(ttlReq);
        callback(userProfile);
      });

      req.fail(function(res) {
        Popup.setContent("Error", "API authentification not available, please try later").show();
        console.info("[Auth] " + JSON.stringify(res));
        Cookies.remove('token');
        callback(false);
      });
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

        callback(playerData.id, playerData.name, playerData.picture, playerData.position, playerData.powerUp, playerData.alive, playerData.kills);
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
    function timeOutReq(req){
      return setTimeout(function() {
        req.abort();
      }, 2000);
    }
  };
});
