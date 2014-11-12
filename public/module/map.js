function Maps(scene){
    var self = this;
    self.scene = scene;
    self.largeur = 11;
    self.longueur = 17;
    self.content = [];

    function createTemporaireBlock (){
        var blockPosition = [
            [0,0],
            //[-42,0],
            //[-43,-65],
            //[-42,20]
        ];
        for(var iBlock = 0 ; iBlock < blockPosition.length; iBlock++){
            // block cassable
            //(function() {
                var block = blockPosition[iBlock];
                ImportMesh("tempBlock", self.scene, true, {x : block[0], y: 0, z: block[1]});

                //BABYLON.SceneLoader.ImportMesh("", "/content/", "tempBlock.babylon", self.scene, function (newMeshes) {
                //    // for every mesh in the model
                //    for (var i in newMeshes) {
                //        // set the scale of the model
                //        //newMeshes[i].scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
                //        // set the position of the model
                //        newMeshes[i].position = new BABYLON.Vector3);
                //        newMeshes[i].checkCollisions = true;
                //        // set relative referential, the model will follow your camera
                //        //newMeshes[i].parent = camera;
                //    }
                //});
            //}());
        }

    }
    self.create = function(){
        var meshs = [
            //['ground', false],
            //['tourColision', false],
            //['permanentBlocks', true]
        ];

        for(var iMesh = 0 ; iMesh < meshs.length; iMesh++){
            ImportMesh(meshs[iMesh][0], self.scene, meshs[iMesh][1]);
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
