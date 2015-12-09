'use strict';/* globals io */

const Cookies = require('js-cookie/src/js.cookie');
const Popup = require('popup/popup.es6');

const url = {
  signIn : '/auth/facebook/token',
  signUp: '/auth/token'
};

var _socket = null;

class Connectors {

  static launch (callback) {
    _socket = io();

    _socket.on('connect', () => {
      callback();
    });

    _socket.on('disconnect', () => {
      const errorMsg = 'Disconnect game, probably you loose internet access or you have already connection active';
      Popup.setContent('Error', errorMsg).show();
      throw  Error(errorMsg);
    });
  }


  //Authentification

  static signUp (token, callback) {
    var req = $.get( url.signIn + '?access_token=' + token);
    var ttlReq = Connectors._timeOutReq(req);

    req.done((userProfile) => {
      clearTimeout(ttlReq);
      callback(userProfile);
    });

    req.fail((res) =>{
      clearTimeout(ttlReq);
      if(res.statusText === 'abort'){
        Popup.setContent('Error', 'Failed to connect API authentification Facebook, please try later').show();
      }
      else if (res.status === 500 ) {
        Popup.setContent('Error', 'API authentification Facebook not available, please try later').show();
      }
      console.warn('[Auth] ' + JSON.stringify(res));
    });
  }

  static signIn (callback) {
    var req = $.get( url.signUp );
    var ttlReq = Connectors._timeOutReq(req);
    req.done((userProfile) => {
      clearTimeout(ttlReq);
      callback(userProfile);
    });

    req.fail( (res) => {
      clearTimeout(ttlReq);
      if(res.statusText === 'abort'){
        Popup.setContent('Error', 'Failed to connect API authentification Facebook, please try later').show();
      }
      else if (res.status === 500 ) {
        clearTimeout(ttlReq);
        Popup.setContent('Error', 'API authentification not available, please try later').show();
      }else {
        Cookies.remove('token');
        callback(false);
      }
      console.warn('[Auth] ' + JSON.stringify(res));
    });
  }

  static _timeOutReq(req){
    return setTimeout(() =>{
      console.error('[Auth] req timeout force abort ');
      req.abort();
    }, 2000);
  }
  
  
  //Game
  static getMap (callback) {
    _socket.on('map', function (map) {

      callback(map);
    });
  }

  static ready () {
    _socket.emit('ready', {});
  }

  static onReady (callback) {
    _socket.on('ready', (partyData) => {
      callback(partyData.partyTimer);
    });
  }

  static onEnd (callback) {
    _socket.on('endPartie', () => {
      callback();
    });
  }

  static sendMyPosition (position) {
    _socket.emit('myPosition', position);
  }

  static onNewPlayer (callback) {
    _socket.on('newPlayer', (playerData) => {

      callback(playerData.id, playerData.name, playerData.picture, playerData.position, playerData.powerUp, playerData.alive, playerData.kills);
    });
  }

  static onPlayerMove (callback) {

    _socket.on('onPlayerMove', (playerData) => {

      callback(playerData.id, playerData.position);
    });
  }

  static onPlayerDisconnect (callback) {

    _socket.on('playerDisconnect', (playerData) => {

      callback(playerData.id);
    });
  }

  static onPlayerSetBomb (callback) {

    _socket.on('setBomb', (bombeData) => {

      callback(bombeData.ownerId, bombeData.bombeId, bombeData.position);
    });
  }

  static setBomb (bombTempId) {

    _socket.emit('setBomb', bombTempId);
  }

  static setPermanentBombId (callback) {
    _socket.on('setPermanentBombId', (data) => {
      callback(data.tempId, data.id);
    });
  }

  static onExplosion (callback) {

    _socket.on('explosion', (explosionData) => {
      callback(explosionData.ownerId, explosionData.bombesExplodedId, explosionData.playersIdKilled, explosionData.blocksIdDestroy);
    });
  }

}

module.exports =  Connectors;
