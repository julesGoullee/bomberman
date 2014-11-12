function Map(){
    this.largeur = 11;
    this.longueur = 17;
    this.content = [];
    this.getplayers = function (){
        var tabPlayer = [];
        var i = 0;
        var size = this.content.length;
        for (i;i<size;i++){
            if (this.content[i].type == 'player'){
                tabPlayer = this.content[i];
            }
        }
        return tabPlayer;
    };
    this.getplayerById = function (id) {
        var players = this.getplayers();
        var size = players.length;
        for (var i = 0; i < size; i++) {
            if (players[i].id == id) {
                return players[i];
            }
        }
        return false;
    };
    this.getbombs = function () {
        var tabBomb = [];
        var players = this.getplayers();
        var size = players.length;
        var i = 0;
        for (i; i < size; i++){
            var player = players[i];
                for (i = 0; i<listBomb.length; i++){
                    tabBomb = this.listBomb[i];
            }
        }
    };
}
