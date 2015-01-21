describe( "Block" , function() {

    var block;

    beforeEach( function() {

        block = new Block( gameMock.assets, { x: 1, z: 0} );
    });

    it( "Peut creer un block temp a la bonne position", function() {
        expect(block.position).toEqual( { x: 1, y: 0, z:0 } );
    });

    it( "Peut creer un block ayant un shape et un block temp", function() {

        expect(block.meshs.shape).not.toBeUndefined();

        expect(block.meshs.colisionBlock).not.toBeUndefined();
    })
});