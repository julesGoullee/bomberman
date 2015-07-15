"use strict";

describe( "timer", function() {


    var timer;

    beforeEach(function () {

        timer = new Timer({});
        timer.showTimerToStartParty( 60 );

        jasmine.clock().install();
        jasmine.clock().tick( cfg.destroyPlayerTimer );
        jasmine.clock().uninstall();
    });

    it( "Peut demarrer le timer", function () {

    });
});