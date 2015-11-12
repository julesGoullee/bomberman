define(["bomb/bomb", "player/player", "utils/utils", "testConfig/mock"], function( Bombe, Player, utils, mock ){
    describe( "Bombe", function(){

        var player;
        var spawnPoint = {x :50, z:-65};
        var bombe;

        beforeEach( function() {

            player = new Player(0, "testPlayer", spawnPoint, {"speed":0.45,"shoot":false,"bombs":2}, true, 0, mock.Game.assets, mock.Game.blockDim );

            bombe = new Bombe( utils.guid(), player, player.position,  mock.Game.assets, mock.Game.blockDim );
        });

        it( "Peut creer une bombe a la bonne position", function() {

            var expectPosition = {
                x: spawnPoint.x,
                y: 0,
                z: spawnPoint.z
            };

            expect( expectPosition ).toEqual( bombe.position );
        });

        it( "Peut détruire une bombe", function () {

            expect( bombe.exploded ).toEqual( false );

            bombe.destroy();

            expect( bombe.exploded ).toEqual( true );
        });
    });
});