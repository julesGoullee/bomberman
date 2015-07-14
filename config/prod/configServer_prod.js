var path = require("path");

module.exports = {
    rootPathPublic : path.resolve( __dirname + "/../../public/" ),
    port : 4430,
    domaine: "monchezmoi.no-ip.org",
    maxPlayerPeerParty : 4,
    timerToStartParty: 60000,
    timerToPlaying: 180000,
    limitToCheckNumberPlayer:10000,
    nbPlayersToStart: 2,
    blockDim: 8,
    showBlockTemp : true,
    bombCountDown : 3000,
    showPowerUp : true,
    nbPowerUp : 50
};