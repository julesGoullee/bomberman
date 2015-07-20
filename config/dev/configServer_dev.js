var path = require("path");

module.exports = {
    rootPathPublic : path.resolve( __dirname + "/../../public/" ),
    port : 3000,
    domaine: "localhost",
    maxPlayerPeerParty : 4,
    timerToStartParty: 15000,
    timerToPlaying: 20000,
    limitToCheckNumberPlayer: 10000,
    nbPlayersToStart: 2,
    blockDim: 8,
    showBlockTemp : true,
    bombCountDown : 3000,
    showPowerUp : true,
    nbPowerUp : 50
};