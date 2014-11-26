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
            x: spawnPoint[0],
            y: 2.5,
            z: spawnPoint[1]
        };

        expect(expectPosition).toEqual(bombe.position);
    });
});