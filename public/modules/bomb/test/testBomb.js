describe( "Bombe" ,function() {

    var player;
    var spawnPoint = [50, -65];
    var bombe;

    beforeEach( function() {

        jasmine.clock().install();

        player = new Player( "testPlayer", spawnPoint, gameMock.assets, gameMock.blockDim );

        bombe = new Bombe( player, player.position,  gameMock.assets, gameMock.blockDim );
    });

    afterEach(function() {
        jasmine.clock().uninstall();
    });

    it( "Peut creer une bombe a la bonne position", function() {

        var expectPosition = {
            x: spawnPoint[0],
            y: 0,
            z: spawnPoint[1]
        };

        expect( expectPosition ).toEqual( bombe.position );
    });

    it( "Peut détruire une bombe", function () {

        jasmine.clock().tick( bombe.countDown );

        expect( bombe.exploded).toEqual( true );
    });
});