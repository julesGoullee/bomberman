var path = require("path");

module.exports = {
    rootPathPublic : path.resolve( __dirname + "/../../public/" ),
    port : 3000,
    domaine: "localhost",
    maxPlayerPeerParty : 4,
    timerToStartParty: 10000,
    timerToPlaying: 60000,
    limitToCheckNumberPlayer: 2000,
    nbPlayersToStart: 1,
    blockDim: 8,
    showBlockTemp : true,
    bombCountDown : 3000,
    showPowerUp : false,
    nbPowerUp : 50
};