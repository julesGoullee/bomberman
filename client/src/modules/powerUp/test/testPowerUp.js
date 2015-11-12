define(["maps/maps", "menuPlayers/menuPlayers", "testConfig/mock"], function(Maps, MenuPlayers, mock){
    describe( "PowerUp", function() {

        var maps;

        beforeEach ( function() {

            maps = new Maps( mock.Game.assets, mock.Game.blockDim, new MenuPlayers() );

        });

    });
});