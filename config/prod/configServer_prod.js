var path = require("path");

module.exports = {
  rootPathPublic : path.resolve( __dirname + "/../../client/dist" ),
  port : 3000,
  domaine: "bombercat.io",
  maxPlayerPeerParty : 4,
  timerToStartParty: 20000,
  timerToPlaying: 360000,
  limitToCheckNumberPlayer: 5000,
  nbPlayersToStart: 2,
  blockDim: 8,
  showBlockTemp : true,
  bombCountDown : 3000,
  showPowerUp : false,
  nbPowerUp : 50,
  analitics: true,
  storage:{
    mongo:{
      base:"bombercat",
      ip:"127.0.0.1"
    }
  }
};
