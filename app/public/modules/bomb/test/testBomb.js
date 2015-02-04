describe( "Bombe" ,function() {

    var player;
    var spawnPoint = {x :50, z:-65};
    var bombe;

    beforeEach( function() {

        jasmine.clock().install();

        player = new Player(0, "testPlayer", spawnPoint, gameMock.assets, gameMock.blockDim );

        bombe = new Bombe( player, player.position,  gameMock.assets, gameMock.blockDim );
    });

    afterEach(function() {

        jasmine.clock().uninstall();
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

        jasmine.clock().tick( bombe.countDown );

        expect( bombe.exploded ).toEqual( true );
    });

    it( "Peut annuler la déstruction d'une bombe", function () {

        var callbackExplodedSpy = jasmine.createSpy('spy');

        bombe.onExploded( callbackExplodedSpy );

        bombe.cancelTimer();

        jasmine.clock().tick( bombe.countDown );

        expect( bombe.exploded ).toEqual( false );

        expect( callbackExplodedSpy ).not.toHaveBeenCalled();

    });

    it( "Peut exectuer un callback apres l'explosion", function() {

        var callbackExplodedSpy = jasmine.createSpy('spy');

        bombe.onExploded( callbackExplodedSpy );

        expect( callbackExplodedSpy ).not.toHaveBeenCalled();

        jasmine.clock().tick( bombe.countDown );

        expect( callbackExplodedSpy ).toHaveBeenCalled();

    });
});