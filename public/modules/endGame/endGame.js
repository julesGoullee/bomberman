"use strict";

function EndGame( popup ){

    var self = this;

    var _popup = popup;

    var _header;
    var _footer;
    var _body;

    var _replayCallback;

    //PUBLIC METHODS//

    self.showEndPopup = function( map ){

        var players = map.getPlayers();
        var tablePlayers = "";

        players.sort(function( a, b ){
            return a.kills <= b.kills;
        });

        for ( var i = 0; i < players.length; i++ ) {
            var player = players[i];
            var statusString = player.alive ? "En vie" : "Mort";
            statusString = player.kamicat || statusString;
            var kills = player.kills > 0 ? player.kills : "-";
            var nbBombe = player.totalNbBombe > 0 ? player.totalNbBombe : "-";
            var nbBlocksDestroy = player.nbBlocksDestroy > 0 ? player.nbBlocksDestroy : "-";

            tablePlayers += "<tr>"+
                "<td>" + kills + "</td>"+
                "<td>" + player.name + "</td>"+
                "<td>" + statusString + "</td>"+
                "<td>" + nbBombe + "</td>"+
                "<td>" + nbBlocksDestroy + "</td>"+
                "</tr>";
        }

        _popup.setContent( _header, _body, _footer );
        $("#table-score-body").append( tablePlayers );

        _popup.show();

        $("#btn-rejouer").click(function(){
            _popup.hide();
            _replayCallback && _replayCallback();
        });
    };

    self.onReplay = function( callback ){
        _replayCallback = callback;
    };

    //PRIVATE METHODS//

    function init(){

        _header = "<h4 class='modal-title' >Partie Terminée!</h4>";

        _footer = "<button type='button' class='btn btn-primary' id='btn-rejouer'>Rejouer!</button>";

        _body = "<table class='table table-striped' id='table-score'>"+
            "<thead>"+
            "<tr>"+
            "<th>Kills</th>"+
            "<th>Nom</th>"+
            "<th>Statu</th>"+
            "<th>Total Bombes</th>"+
            "<th>Total blocks</th>"+
            "</tr>"+
            "</thead>"+
            "<tbody id='table-score-body'></tbody>"+
            "</table>";
    }

    init();

}