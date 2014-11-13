"use strict";
function Maps(){
    var self = this;
    self.largeur = 10;
    self.longueur = 16;
    self.blockDim = 8;
    self.content = [];

    function createTemporaireBlock (){
        for(var iBlockLargeur = -self.largeur/2 ; iBlockLargeur <= self.largeur/2; iBlockLargeur++){
            // block cassable
            for(var iBlockLongueur = - self.longueur/2 ; iBlockLongueur <= self.longueur/2; iBlockLongueur++){

                if(iBlockLargeur % 2 !== 0 ){
                    var blockPosition = {
                        x:iBlockLargeur*self.blockDim,
                        z:iBlockLongueur*self.blockDim
                    };
                    var block = new Block(blockPosition);
                    //_meshHelper.importMesh.("tempBlock", self.scene, true, {x: blockPosition.x, y: 0, z: blockPosition.z});
                }
                else if(iBlockLongueur% 2 === 0 ) {
                    var blockPosition = {
                        x:iBlockLargeur*self.blockDim,
                        z:iBlockLongueur*self.blockDim
                    };
                    var block = new Block(blockPosition);
                    //_meshHelper.importMesh("tempBlock", self.scene, true, {x: blockPosition.x, y: 0, z: blockPosition.z});

                }
            }
        }

    }
    self.create = function(){
        var meshs = [
            ['ground', false],
            ['tourColision', false],
            ['permanentBlocks', true]
        ];

        for(var iMesh = 0 ; iMesh < meshs.length; iMesh++){
            _meshHelper.importMesh(meshs[iMesh][0], meshs[iMesh][1]);
        }
        createTemporaireBlock();
    };

    self.getPlayers = function (){
        var tabPlayer = [];
        var i = 0;
        var size = self.content.length;
        for (i;i<size;i++){
            if (self.content[i].type == 'player'){
                tabPlayer = self.content[i];
            }
        }
        return tabPlayer;
    };
    self.getPlayerById = function (id) {
        var players = self.getPlayers();
        var size = players.length;
        for (var i = 0; i < size; i++) {
            if (players[i].id == id) {
                return players[i];
            }
        }
        return false;
    };
    self.getBombs = function () {
        var tabBomb = [];
        var players = self.getPlayers();
        var size = players.length;
        var i = 0;
        for (i; i < size; i++){
            var player = players[i];
            for (i = 0; i<player.listBombs.length; i++){
                tabBomb = player.listBombs[i];
            }
        }
        return tabBomb;
    };
}
