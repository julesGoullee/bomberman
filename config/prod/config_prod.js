var path = require("path");

module.exports = {
    rootPath : "",
    rootPathPublic : path.resolve(__dirname + "/../../public/"),
    port : 80,
    domaine: "monchezmoi.no-ip.org",
    maxPlayerPeerParty : 4,
    blockDim: 8,
    showBlockTemp : true,
    bombCountDown : 3000,
    showPowerUp : true,
    nbPowerUp : 50
};
