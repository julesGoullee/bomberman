function Maps(scene){
    var self = this;
    self.scene = scene;
    self.largeur = 11;
    self.longueur = 17;
    self.content = [];

    self.create = function(){
        var meshWithoutCollision = [
            'block'
        ];

        var meshWithCollision = [
            'sol',
            'cubesTransparents',
            'tourMapTransparent'
        ];
        for(var iMeshCollision = 0 ; iMeshCollision < meshWithCollision.length; iMeshCollision++){
            ImportMesh(meshWithCollision[iMeshCollision], self.scene, true);
        }
        for(var iMeshWithoutCollision = 0 ; iMeshWithoutCollision < meshWithoutCollision.length; iMeshWithoutCollision++){
            ImportMesh(meshWithoutCollision[iMeshWithoutCollision], self.scene, false);
        }
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
