describe( "Bombe" ,function() {

    var player;
    var spawnPoint = [50, -65];
    var bombe;

    beforeEach( function() {

        player = new Player( "testPlayer", spawnPoint, gameMock.assets );
        bombe = new Bombe( player, player.position,  gameMock.assets);
    });

    it( "Peut creer une bombe a la bonne position", function() {

        var expectPosition = {
            x: spawnPoint[0] +10,//todo decalage player
            y: 3,
            z: spawnPoint[1] + 2.5//todo decalage bombe
        };

        expect( expectPosition ).toEqual( bombe.position );
    });
});