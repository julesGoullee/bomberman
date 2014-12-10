"use strict";

function Restore ( notifier, map, myPlayer ) {

    var self = this;

    var _restartConfig = {
        player: {
            position: false,
            destroyBombs : false
        },
        map: {
            block: false
        }

    };

    //PUBLIC METHODS//

    self.showRestartButton = function () {

        var restoreDropDown = "<div class='btn-group dropdown' id='restartDropDown'>" +
                "<button type='button' class='btn btn-default' id='restartButton'>Restart or press key R</button>" +
                "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-expanded='true'>" +
                    "<span class='caret'></span>" +
                "</button>" +
                "<ul class='dropdown-menu dropdown-menu-right' role='menu'>" +
                    "<li class='list-group-item'>" +
                        "<span class='label list-group-item active'>Player</span>"+
                        "<div class='checkbox list-group-item' >" +
                            "<label>" +
                                "<input type='checkbox' id='restartPlayerPosition'>Position" +
                            "</label>" +
                            "<label>" +
                                "<input type='checkbox' id='restartPlayerBombe'>Bombe" +
                            "</label>" +
                            "<label>" +
                                "<input type='checkbox' id='restartPlayerKill'>Kill" +
                            "</label>" +
                            "<label>" +
                                "<input type='checkbox' id='restartPlayerAlive'>Alive" +
                            "</label>" +
                        "</div>" +
                    "</li>" +
                    "<li class='list-group-item'>" +
                        "<span class='label label-default list-group-item active'>Map</span>"+
                        "<div class='checkbox list-group-item' >" +
                            "<label>" +
                                "<input type='checkbox' id=''><span>Block</span>" +
                            "</label>" +
                        "</div>" +
                    "</li>" +
                "</ul>" +
            "</div>";

        $( "body" ).append( restoreDropDown );

        $( ".dropdown-menu" ).click( function( e ) {

            e.stopPropagation();
        });

        $( "#restartButton" ).click( function() {

            self.run();
        });
    };

    self.run = function () {

        _restartConfig.player.position = $( "#restartPlayerPosition" ).prop( "checked" );
        _restartConfig.player.destroyBombs = $( "#restartPlayerBombe" ).prop( "checked" );

        if ( _restartConfig.player.position ) {

            myPlayer.restoreInit( _restartConfig.player.position );
        }

        if ( _restartConfig.player.destroyBombs ) {
            map.delBombs();
        }
        if ( _restartConfig.player.destroyBombs || _restartConfig.player.position) {

            notifier.showMessage("Restart!");
        }
        //todo restorer les params du player ( bombe, kill, alive speed..) &
        //todo map (  block, player...)
        //todo que faire des bombes deja posé ?
    };

}