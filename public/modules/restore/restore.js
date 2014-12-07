"use strict";

function Restore ( map, myPlayer ) {

    var self = this;

    var _restartPlayerPosition = false;
    //PUBLIC METHODS//

    self.showRestartButton = function () {

        var restoreDropDown = "<div class='btn-group dropdown' id='restartDropDown'>" +
                "<button type='button' class='btn btn-default' id='restartButton'>Restart</button>" +
                "<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown' aria-expanded='true'>" +
                    "<span class='caret'></span>" +
                "</button>" +
                "<ul class='dropdown-menu dropdown-menu-right' role='menu'>" +
                    "<li>" +
                        "<div class='checkbox text-center' >" +
                            "<button type='button' class='btn btn-xs btn-default' >" +
                                "<label>" +
                                "<input type='checkbox' id='restartPlayerPosition'><span>Player position</span>" +
                                "</label>" +
                            "</button>"+
                        "</div>" +
                    "</li>" +
                "</ul>" +
            "</div>";

        $( "body" ).append( restoreDropDown );

        $( ".dropdown-menu" ).click( function( e ) {

            e.stopPropagation();
        });

        $( "#restartButton" ).click( function() {

            _restartPlayerPosition = $( "#restartPlayerPosition" ).prop( "checked" );

            self.run();
        });
    };

    self.run = function () {

        if ( _restartPlayerPosition ) {
            myPlayer.restoreInit();

            //todo restorer les params du player ( bombe, kill, alive speed..) &
            //todo map (  block, player...)
            //todo que faire des bombes deja posé ?

        }
    };

}